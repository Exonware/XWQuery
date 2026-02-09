// XWUIFormMaster_draft_ref - Reference / draft implementation
// A complete, single-file representation of the xwForms-style application UI.
// Built with React, TypeScript, and styled with Tailwind CSS.
// ENHANCED VERSION with horizontal drop zones for column splitting.
//
// NOTE FOR FREELANCER / XWUI:
// - This file lives in `xwui/task/trial_task/XWUIFormMaster_draft_ref.ts`.
// - It is **reference / prototype code only** for the **XWUIFormMaster**
//   form management component. Canonical sources (same folder):
//     - FREELANCER_TASK_01_FORM_MANAGER.md — full brief, requirements, deliverables
//     - XWUIFormMaster.pdf — states, flows, screenshots, and detailed task info
//     - This file — reference behavior only. Refer to the PDF for screenshots and more.
// - Do NOT copy-paste or ship this file as production code.
//   Instead:
//   - Study the JSON model (config + schema + data).
//   - Observe how the tabs (EDITOR, FORM JSON, ADD, LIST, VIEW, UPDATE,
//     FORM DATA JSON) demonstrate full CRUD flows.
//   - Refer to XWUIFormMaster.pdf for screenshots and more detailed info.
//   - Look at how sections/rows/columns/elements are rendered and edited.
//   Then design a clean, reusable **XWUIFormMaster** component that fits XWUI’s
//   patterns and stylization, extracting only the pieces you actually need.

import React, { useState, FC, DragEvent, ChangeEvent, useEffect, useRef } from 'react';

// --- SCHEMA-DRIVEN TYPE DEFINITIONS ---

// A comprehensive list of all possible component types.
type FormElementType = 
  // Basic Inputs
  | 'text' | 'textarea' | 'password' | 'email' | 'number' | 'phone' | 'url'
  // Selectors
  | 'select' | 'multiselect' | 'radio' | 'checkbox' | 'toggle'
  // Date & Time
  | 'date' | 'daterange' | 'time' | 'datetime'
  // Media & Graphics
  | 'file' | 'image' | 'signature' | 'color'
  // Advanced & Layout
  | 'richtext' | 'map_location_picker' | 'rating' | 'repeater' | 'title' | 'subtitle' | 'paragraph'
  // Data Entry Specializations
  | 'masked' | 'currency' | 'creditcard';

// The definition for a single component within the schema.
interface ComponentDefinition {
  category: string;
  icon: keyof typeof Icons;
  // Default properties when a new component of this type is created.
  defaultProps: Partial<FormField | DisplayElement>;
}

// The main schema object, mapping component types to their definitions.
type FormSchema = {
  [key in FormElementType]?: ComponentDefinition;
};

interface BaseElement {
  id: string;
  type: FormElementType;
  subtitle?: string;
  description?: string;
  photo?: string; // URL to an image
}

type FormElement = FormField | DisplayElement;

interface Column {
  id: string;
  width: 'full' | '1/2' | '1/3' | '2/3';
  element: FormElement;
}

interface Row {
  id: string;
  columns: Column[];
  condition?: {
    fieldId: string;
    operator: 'equals' | 'notEquals';
    value: any;
  };
}

interface Section {
  id: string;
  title: string;
  rows: Row[];
}

interface DisplayElement extends BaseElement {
  type: 'title' | 'subtitle' | 'paragraph';
  content: string;
}

interface FormField extends BaseElement {
  type: Exclude<FormElementType, 'title' | 'subtitle' | 'paragraph'>;
  label: string;
  placeholder?: string;
  options?: string[];
  mask?: string; // For masked input
  validation?: {
    regex: string;
    message: string;
  };
}

interface FormDefinition {
  config: {
    uid: string;
    version: string;
    name: string;
  };
  schema: FormSchema;
  data: {
    sections: Section[];
  };
}

type SubmittedData = {
  id: number;
  [key: string]: any;
};

// --- UI ICONS (Expanded Set) ---
const Icon: FC<{ path: string; className?: string }> = ({ path, className = "h-5 w-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
);

const DraggableIcon: FC<{ path: string }> = ({ path }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
);

const Icons = {
  text: <DraggableIcon path="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />,
  select: <DraggableIcon path="M8 9l4-4 4 4m0 6l-4 4-4-4" />,
  map_location_picker: <DraggableIcon path="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" />,
  date: <DraggableIcon path="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />,
  datetime: <DraggableIcon path="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z M12 18a3 3 0 100-6 3 3 0 000 6z" />,
  time: <DraggableIcon path="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
  rating: <DraggableIcon path="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />,
  signature: <DraggableIcon path="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />,
  trash: <Icon path="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />,
  eye: <Icon path="M15 12a3 3 0 11-6 0 3 3 0 016 0zM21 12c-2.28 4.56-6.42 7.5-10.5 7.5S2.28 16.56 0 12c2.28-4.56 6.42-7.5 10.5-7.5S18.72 7.44 21 12z" />,
  pencil: <Icon path="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />,
  user: <Icon path="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />,
  email: <Icon path="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />,
  number: <DraggableIcon path="M13 10V3L4 14h7v7l9-11h-7z" />,
  checkbox: <DraggableIcon path="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />,
  ai: <Icon path="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" className="h-8 w-8"/>,
  plus: <Icon path="M12 4v16m8-8H4" />,
  chevronLeft: <Icon path="M15 19l-7-7 7-7" />,
  chevronRight: <Icon path="M9 5l7 7-7 7" />,
  phone: <DraggableIcon path="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />,
  creditcard: <DraggableIcon path="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />,
  richtext: <DraggableIcon path="M18.5 15a.5.5 0 00.5-.5v-11a.5.5 0 00-1 0v11a.5.5 0 00.5.5zM16 15a1 1 0 01-1-1V4a1 1 0 012 0v10a1 1 0 01-1 1zM2 15a1 1 0 01-1-1V4a1 1 0 012 0v10a1 1 0 01-1 1zM5.5 15a.5.5 0 00.5-.5v-11a.5.5 0 00-1 0v11a.5.5 0 00.5.5zM8 15a1 1 0 01-1-1V4a1 1 0 012 0v10a1 1 0 01-1 1zM11.5 15a.5.5 0 00.5-.5v-11a.5.5 0 00-1 0v11a.5.5 0 00.5.5z" />,
  repeater: <DraggableIcon path="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />,
  toggle: <DraggableIcon path="M12 6.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM12 4a8 8 0 110 16 8 8 0 010-16z" />,
  file: <DraggableIcon path="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
  radio: <DraggableIcon path="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
  url: <DraggableIcon path="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.555a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />,
  password: <DraggableIcon path="M15 7a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9a2 2 0 012-2h6zM15 7A5 5 0 005 7" />,
  title: <DraggableIcon path="M4 6h16M4 10h16M4 14h16M4 18h16" />,
  subtitle: <DraggableIcon path="M4 7h16M4 11h12M4 15h16" />,
  paragraph: <DraggableIcon path="M4 6h16M4 10h16M4 14h10M4 18h14" />,
  arrowUp: <Icon path="M5 15l7-7 7 7" className="h-4 w-4"/>,
  arrowDown: <Icon path="M19 9l-7 7-7-7" className="h-4 w-4"/>,
  grab: <Icon path="M4 8h4V4H4v4zm6 0h4V4h-4v4zm6 0h4V4h-4v4zM4 14h4v-4H4v4zm6 0h4v-4h-4v4zm6 0h4v-4h-4v4zM4 20h4v-4H4v4zm6 0h4v-4h-4v4zm6 0h4v-4h-4v4z" className="h-5 w-5 cursor-grab active:cursor-grabbing"/>,
};

// --- SCHEMA-DRIVEN MOCK DATA ---
const mockFormDefinition: FormDefinition = {
  config: { uid: 'f-event-reg-05', version: '5.0.0', name: 'Tech Conference 2025 Registration' },
  schema: {
    'title': { category: 'Layout', icon: 'title', defaultProps: { type: 'title', content: 'New Title' } },
    'subtitle': { category: 'Layout', icon: 'subtitle', defaultProps: { type: 'subtitle', content: 'New Subtitle' } },
    'paragraph': { category: 'Layout', icon: 'paragraph', defaultProps: { type: 'paragraph', content: 'New paragraph text.' } },
    'text': { category: 'Basic Inputs', icon: 'text', defaultProps: { type: 'text', label: 'Text Field' } },
    'email': { category: 'Basic Inputs', icon: 'email', defaultProps: { type: 'email', label: 'Email Field' } },
    'password': { category: 'Basic Inputs', icon: 'password', defaultProps: { type: 'password', label: 'Password Field' } },
    'number': { category: 'Basic Inputs', icon: 'number', defaultProps: { type: 'number', label: 'Number Field' } },
    'textarea': { category: 'Basic Inputs', icon: 'text', defaultProps: { type: 'textarea', label: 'Text Area' } },
    'phone': { category: 'Data Entry', icon: 'phone', defaultProps: { type: 'text', label: 'Phone Number', placeholder: '(555) 555-5555' } },
    'creditcard': { category: 'Data Entry', icon: 'creditcard', defaultProps: { type: 'text', label: 'Credit Card', placeholder: '0000 0000 0000 0000' } },
    'select': { category: 'Selectors', icon: 'select', defaultProps: { type: 'select', label: 'Select Dropdown', options: ['Option 1'] } },
    'checkbox': { category: 'Selectors', icon: 'checkbox', defaultProps: { type: 'checkbox', label: 'Checkbox' } },
    'radio': { category: 'Selectors', icon: 'radio', defaultProps: { type: 'radio', label: 'Radio Group', options: ['Option 1'] } },
    'toggle': { category: 'Selectors', icon: 'toggle', defaultProps: { type: 'checkbox', label: 'Toggle Switch' } }, // Rendered as checkbox
    'date': { category: 'Date & Time', icon: 'date', defaultProps: { type: 'date', label: 'Date' } },
    'datetime': { category: 'Date & Time', icon: 'datetime', defaultProps: { type: 'datetime', label: 'Date & Time' } },
    'time': { category: 'Date & Time', icon: 'time', defaultProps: { type: 'time', label: 'Time' } },
    'file': { category: 'Advanced', icon: 'file', defaultProps: { type: 'file', label: 'File Upload' } },
    'signature': { category: 'Advanced', icon: 'signature', defaultProps: { type: 'signature', label: 'Signature' } },
    'rating': { category: 'Advanced', icon: 'rating', defaultProps: { type: 'rating', label: 'Rating' } },
    'map_location_picker': { category: 'Advanced', icon: 'map_location_picker', defaultProps: { type: 'text', label: 'Location' } }, // Placeholder
    'richtext': { category: 'Advanced', icon: 'richtext', defaultProps: { type: 'textarea', label: 'Rich Text' } }, // Placeholder
    'repeater': { category: 'Advanced', icon: 'repeater', defaultProps: { type: 'text', label: 'Repeater' } }, // Placeholder
  },
  data: {
    sections: [
      {
        id: 'sec_attendee', title: 'Attendee Information',
        rows: [
          { id: 'row_title', columns: [{ id: 'col_title', width: 'full', element: { id: 'el_title', type: 'title', content: 'Event Registration', photo: 'https://placehold.co/80x80/6366f1/ffffff?text=xForms' } }] },
          { id: 'row_name', columns: [
              { id: 'col_fname', width: '1/2', element: { id: 'firstName', type: 'text', label: 'First Name', placeholder: 'Jane', icon: 'user', subtitle: 'Legal first name' } },
              { id: 'col_lname', width: '1/2', element: { id: 'lastName', type: 'text', label: 'Last Name', placeholder: 'Doe', description: 'As it appears on your ID.' } }
          ]},
          { id: 'row_contact', columns: [
              { id: 'col_email', width: '1/2', element: { id: 'email', type: 'email', label: 'Email Address', placeholder: 'you@example.com', icon: 'email' } },
              { id: 'col_phone', width: '1/2', element: { id: 'phone', type: 'phone', label: 'Phone Number', placeholder: '(555) 555-5555' } }
          ]},
          { id: 'row_zip', columns: [{ id: 'col_zip', width: '1/3', element: { id: 'postalCode', type: 'text', label: 'Postal Code', placeholder: 'e.g., 90210', validation: { regex: '^\\d{5}$', message: 'Must be 5 digits' } } }] },
        ]
      },
      {
        id: 'sec_payment', title: 'Payment Details',
        rows: [
            { id: 'row_cc', columns: [{ id: 'col_cc', width: '2/3', element: { id: 'creditCard', type: 'creditcard', label: 'Credit Card Number', placeholder: '0000 0000 0000 0000' } }] }
        ]
      }
    ]
  }
};

const mockSubmittedData: SubmittedData[] = [
  { id: 101, firstName: 'Ada', lastName: 'Lovelace', email: 'ada@babbage.com', postalCode: '12345', phone: '(123) 456-7890' },
  { id: 102, firstName: 'Grace', lastName: 'Hopper', email: 'grace@cobol.dev', postalCode: '54321', phone: '(987) 654-3210' },
];

// --- UTILITY FUNCTIONS ---
const createNewElement = (type: FormElementType, schema: FormSchema): FormElement => {
    const randomSuffix = Math.random().toString(36).substring(2, 9);
    const id = `${type}-${Date.now()}-${randomSuffix}`;
    const definition = schema[type];
    const baseElement = { id, type, ...definition?.defaultProps };
    return baseElement as FormElement;
};

// --- REUSABLE COMPONENTS ---
const JsonViewComponent: FC<{ title: string, jsonData: object, monacoLoaded: boolean }> = ({ title, jsonData, monacoLoaded }) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const editorInstanceRef = useRef<any>(null);

    useEffect(() => {
        if (monacoLoaded && editorRef.current && !editorInstanceRef.current) {
            const monaco = (window as any).monaco;
            editorInstanceRef.current = monaco.editor.create(editorRef.current, {
                value: JSON.stringify(jsonData, null, 2),
                language: 'json',
                theme: 'vs-dark',
                readOnly: true,
                automaticLayout: true,
            });
        }

        return () => {
            if (editorInstanceRef.current) {
                editorInstanceRef.current.dispose();
                editorInstanceRef.current = null;
            }
        };
    }, [monacoLoaded, jsonData]);

    useEffect(() => {
        if (editorInstanceRef.current) {
            editorInstanceRef.current.setValue(JSON.stringify(jsonData, null, 2));
        }
    }, [jsonData]);

    return (
        <div className="bg-slate-800 rounded-lg p-1 h-[600px] overflow-hidden shadow-inner">
            <div ref={editorRef} style={{ width: '100%', height: '100%' }}></div>
        </div>
    );
};

const ElementRenderer: FC<{ 
    element: FormElement, 
    isReadOnly: boolean, 
    value: any, 
    onChange: (id: string, value: any) => void, 
    error?: string, 
    onContextMenu?: (e: React.MouseEvent, element: FormElement) => void, 
    onDoubleClick?: (element: FormElement) => void, 
    isEditing: boolean,
    onMove?: (direction: 'up' | 'down') => void,
    onDelete?: (id: string) => void,
    onEdit?: (element: FormElement) => void,
    onDragStart?: (e: DragEvent<HTMLDivElement>) => void,
    onDragEnd?: (e: DragEvent<HTMLDivElement>) => void,
}> = ({ element, isReadOnly, value, onChange, error, onContextMenu, onDoubleClick, isEditing, onMove, onDelete, onEdit, onDragStart, onDragEnd }) => {
  const IconComponent = 'icon' in element && element.icon ? Icons[element.icon] : null;
  const mainLabel = 'label' in element ? element.label : ('content' in element ? element.content : '');

  return (
    <div 
        onContextMenu={isEditing ? (e) => onContextMenu?.(e, element) : undefined} 
        onDoubleClick={isEditing ? () => onDoubleClick?.(element) : undefined} 
        className="relative group p-2 rounded-md hover:bg-indigo-50 cursor-pointer"
    >
      {isEditing && (
          <div className="absolute top-0 right-0 flex items-center bg-white border rounded-full shadow-md p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <button onClick={() => onEdit?.(element)} title="Edit" className="p-1 text-slate-500 hover:text-indigo-600">{Icons.pencil}</button>
              <button onClick={() => onMove?.('up')} title="Move Up" className="p-1 text-slate-500 hover:text-indigo-600">{Icons.arrowUp}</button>
              <button onClick={() => onMove?.('down')} title="Move Down" className="p-1 text-slate-500 hover:text-indigo-600">{Icons.arrowDown}</button>
              <button onClick={() => onDelete?.(element.id)} title="Delete" className="p-1 text-slate-500 hover:text-red-600">{Icons.trash}</button>
              <div title="Drag to Move" draggable={isEditing} onDragStart={onDragStart} onDragEnd={onDragEnd} className="p-1 text-slate-500 drag-handle">{Icons.grab}</div>
          </div>
      )}
      <div className="flex items-start gap-3">
        {element.photo && <img src={element.photo} alt="Element photo" className="h-12 w-12 rounded-md object-cover" />}
        <div className="flex-1">
          <label htmlFor={element.id} className="flex items-center text-sm font-medium text-slate-700">
            {IconComponent && <span className="mr-2 text-slate-500">{IconComponent}</span>}
            {mainLabel}
          </label>
          {element.subtitle && <p className="text-xs text-slate-500">{element.subtitle}</p>}
        </div>
      </div>
      {element.description && <p className="mt-1 text-xs text-slate-500">{element.description}</p>}
      
      {(() => {
        const commonProps = { id: element.id, readOnly: isReadOnly, disabled: isReadOnly, value: value || '', onChange: (e: any) => onChange(element.id, e.target.type === 'checkbox' ? e.target.checked : e.target.value), placeholder: 'placeholder' in element ? element.placeholder : '', className: `w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 read-only:bg-slate-100 disabled:bg-slate-100 ${error ? 'border-red-500' : 'border-slate-300'}`};
        switch (element.type) {
          case 'title': return <h1 className="text-3xl font-bold text-slate-900 mt-2">{element.content}</h1>;
          case 'subtitle': return <h2 className="text-xl font-semibold text-slate-700 mt-1">{element.content}</h2>;
          case 'paragraph': return <p className="text-slate-600 mt-1">{element.content}</p>;
          case 'textarea': return <textarea {...commonProps} rows={4} className={`${commonProps.className} mt-2`} />;
          case 'select': return <select {...commonProps} className={`${commonProps.className} mt-2`}>{(element as FormField).options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}</select>;
          case 'radio': return <div className="flex flex-wrap items-center gap-4 mt-2">{(element as FormField).options?.map(opt => <div key={opt} className="flex items-center"><input type="radio" id={`${element.id}-${opt}`} name={element.id} value={opt} disabled={isReadOnly} checked={value === opt} onChange={(e) => onChange(element.id, e.target.value)} className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500" /><label htmlFor={`${element.id}-${opt}`} className="ml-2 block text-sm text-gray-900">{opt}</label></div>)}</div>;
          case 'checkbox': return <div className="flex items-center mt-2"><input {...commonProps} type="checkbox" checked={!!value} className="h-4 w-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500" /></div>;
          case 'datetime': return <input {...commonProps} type="datetime-local" className={`${commonProps.className} mt-2`} />;
          case 'file': return <input id={element.id} type="file" disabled={isReadOnly} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 disabled:opacity-50 mt-2"/>;
          case 'signature': return <div className="w-full h-24 bg-slate-50 rounded-md border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 mt-2">{isReadOnly ? `[Signed]` : 'Signature Pad'}</div>;
          case 'phone':
          case 'creditcard':
             // Simple placeholder for masked inputs
             return <input {...commonProps} type="text" className={`${commonProps.className} mt-2`} />;
          case 'richtext':
             return <div className="w-full h-48 bg-slate-50 rounded-md border border-slate-300 p-2 text-slate-400 mt-2">[Rich Text Editor Area]</div>;
          default: return <input {...commonProps} type={element.type} className={`${commonProps.className} mt-2`} />;
        }
      })()}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

const DropZone: FC<{ onDrop: (e: DragEvent<HTMLDivElement>) => void; isDragging: boolean }> = ({ onDrop, isDragging }) => {
    const [isOver, setIsOver] = useState(false);
    if (!isDragging) return null;
    return (
        <div 
            onDrop={(e) => { e.preventDefault(); setIsOver(false); onDrop(e); }}
            onDragOver={(e) => { e.preventDefault(); setIsOver(true); }}
            onDragLeave={() => setIsOver(false)}
            className={`h-12 my-2 border-2 border-dashed rounded-lg transition-all duration-200 flex items-center justify-center text-indigo-500 ${isOver ? 'border-indigo-500 bg-indigo-100' : 'border-slate-300 bg-slate-50'}`}
        >
          Place Component Here
        </div>
    );
};

const FormRenderer: FC<{
    definition: FormDefinition;
    mode: 'add' | 'view' | 'update' | 'edit';
    initialData?: SubmittedData | null;
    buttonText?: string;
    onDrop?: (sectionId: string, rowIndex: number, elementType: FormElementType) => void;
    isDragging?: boolean;
    onElementUpdate?: (updatedElement: FormElement) => void;
    onElementDelete?: (elementId: string) => void;
    onElementRightClick?: (e: React.MouseEvent, element: FormElement) => void;
    onElementDoubleClick?: (element: FormElement) => void;
    onElementMove?: (rowId: string, direction: 'up' | 'down') => void;
}> = ({ definition, mode, initialData, buttonText, onDrop, isDragging = false, onElementUpdate, onElementDelete, onElementRightClick, onElementDoubleClick, onElementMove }) => {
  const [activeSection, setActiveSection] = useState(definition.data.sections[0]?.id);
  const [formState, setFormState] = useState<Record<string, any>>(initialData || {});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => { setFormState(initialData || {}); }, [initialData]);
  useEffect(() => { if (!definition.data.sections.find(s => s.id === activeSection)) { setActiveSection(definition.data.sections[0]?.id); } }, [definition, activeSection]);

  const handleStateChange = (id: string, value: any) => {
    const newFormState = { ...formState, [id]: value };
    setFormState(newFormState);
    validateField(id, value);
  };

  const validateField = (id: string, value: any) => {
    const fieldDef = definition.data.sections.flatMap(s => s.rows.flatMap(r => r.columns.map(c => c.element))).find(el => el.id === id) as FormField | undefined;
    if (fieldDef?.validation) {
      const regex = new RegExp(fieldDef.validation.regex);
      if (!value || !regex.test(value)) {
        setErrors(prev => ({ ...prev, [id]: fieldDef.validation!.message }));
      } else {
        setErrors(prev => { const newErrors = { ...prev }; delete newErrors[id]; return newErrors; });
      }
    }
  };

  const checkCondition = (condition?: Row['condition']) => {
    if (!condition) return true;
    const { fieldId, operator, value } = condition;
    const fieldValue = formState[fieldId];
    if (operator === 'equals') return fieldValue === value;
    if (operator === 'notEquals') return fieldValue !== value;
    return true;
  };
  
  const handleDropEvent = (e: DragEvent<HTMLDivElement>, sectionId: string, rowIndex: number) => {
      const elementType = e.dataTransfer.getData("application/x-xforms-element-type") as FormElementType;
      onDrop?.(sectionId, rowIndex, elementType);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">{definition.config.name}</h2>
          <p className="text-slate-500">Mode: {mode.toUpperCase()}</p>
        </div>
        <div className="border-b border-slate-200 px-8">
          <nav className="-mb-px flex space-x-6 overflow-x-auto">{definition.data.sections.map(sec => <button key={sec.id} onClick={() => setActiveSection(sec.id)} className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeSection === sec.id ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>{sec.title}</button>)}</nav>
        </div>
        <div className="p-8">
          {definition.data.sections.map(section => (
            <div key={section.id} className={`${activeSection === section.id ? 'block' : 'hidden'}`}>
              {mode === 'edit' && <DropZone isDragging={isDragging} onDrop={(e) => handleDropEvent(e, section.id, 0)} />}
              {section.rows.map((row, rowIndex) => (
                checkCondition(row.condition) && (
                  <div key={row.id}>
                      <div className="flex flex-wrap md:flex-nowrap gap-6 my-4">
                      {row.columns.map(col => (
                          <div key={col.id} className={{ 'full': 'w-full', '1/2': 'w-full md:w-1/2', '1/3': 'w-full md:w-1/3', '2/3': 'w-full md:w-2/3' }[col.width]}>
                          <ElementRenderer 
                            element={col.element} 
                            isReadOnly={mode === 'view'} 
                            value={formState[col.element.id]} 
                            onChange={handleStateChange} 
                            error={errors[col.element.id]} 
                            onContextMenu={onElementRightClick} 
                            onDoubleClick={onElementDoubleClick} 
                            isEditing={mode === 'edit'}
                            onDelete={onElementDelete}
                            onEdit={onElementDoubleClick}
                            onMove={(dir) => onElementMove?.(row.id, dir)}
                          />
                          </div>
                      ))}
                      </div>
                      {mode === 'edit' && <DropZone isDragging={isDragging} onDrop={(e) => handleDropEvent(e, section.id, rowIndex + 1)} />}
                  </div>
                )
              ))}
            </div>
          ))}
          {buttonText && mode !== 'view' && <button className="mt-8 w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-md hover:bg-indigo-700">{buttonText}</button>}
        </div>
      </div>
    </>
  );
};

// --- TAB COMPONENTS ---
const EditorComponent: FC<{ 
    formDefinition: FormDefinition;
    setFormDefinition: React.Dispatch<React.SetStateAction<FormDefinition>>;
    isDragging: boolean;
    setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ formDefinition, setFormDefinition, isDragging, setIsDragging }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; element: FormElement } | null>(null);
  const [editingElement, setEditingElement] = useState<FormElement | null>(null);

  const handleDrop = (sectionId: string, rowIndex: number, elementType: FormElementType) => {
    if (!elementType) return;
    const newElement = createNewElement(elementType, formDefinition.schema);
    const newRow: Row = { id: `row-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`, columns: [{ id: `col-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`, width: 'full', element: newElement }] };
    
    const newSections = formDefinition.data.sections.map(s => {
        if (s.id === sectionId) {
            const newRows = [...s.rows];
            newRows.splice(rowIndex, 0, newRow);
            return { ...s, rows: newRows };
        }
        return s;
    });
    setFormDefinition(def => ({ ...def, data: { ...def.data, sections: newSections } }));
  };
  
  const handleElementUpdate = (updatedElement: FormElement) => {
      const newSections = formDefinition.data.sections.map(section => ({
          ...section,
          rows: section.rows.map(row => ({
              ...row,
              columns: row.columns.map(col => col.element.id === updatedElement.id ? { ...col, element: updatedElement } : col)
          }))
      }));
      setFormDefinition(def => ({ ...def, data: { ...def.data, sections: newSections } }));
  };

  const handleElementDelete = (elementId: string) => {
    const newSections = formDefinition.data.sections.map(section => ({
        ...section,
        rows: section.rows.filter(row => row.columns.every(col => col.element.id !== elementId))
    }));
    setFormDefinition(def => ({ ...def, data: { ...def.data, sections: newSections } }));
  };
  
  const handleElementMove = (rowId: string, direction: 'up' | 'down') => {
      setFormDefinition(def => {
          const newDef = JSON.parse(JSON.stringify(def));
          for (const section of newDef.data.sections) {
              const rowIndex = section.rows.findIndex((r: Row) => r.id === rowId);
              if (rowIndex !== -1) {
                  if (direction === 'up' && rowIndex > 0) {
                      [section.rows[rowIndex], section.rows[rowIndex - 1]] = [section.rows[rowIndex - 1], section.rows[rowIndex]];
                  } else if (direction === 'down' && rowIndex < section.rows.length - 1) {
                      [section.rows[rowIndex], section.rows[rowIndex + 1]] = [section.rows[rowIndex + 1], section.rows[rowIndex]];
                  }
                  break;
              }
          }
          return newDef;
      });
  };
  
  const handleContextMenu = (e: React.MouseEvent, element: FormElement) => {
      e.preventDefault();
      setContextMenu({ x: e.clientX, y: e.clientY, element });
  };

  const componentList = Object.entries(formDefinition.schema).map(([type, def]) => ({
      name: (def.defaultProps as FormField).label || (def.defaultProps as DisplayElement).content || type,
      type: type as FormElementType,
      icon: Icons[def.icon],
      category: def.category
  }));
  
  const filteredComponents = componentList.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const groupedComponents = filteredComponents.reduce((acc, comp) => {
      acc[comp.category] = [...(acc[comp.category] || []), comp];
      return acc;
  }, {} as Record<string, typeof componentList>);

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className={`bg-white p-4 rounded-lg shadow-md transition-all duration-300 ${isMenuOpen ? 'w-full lg:w-1/4' : 'w-12'}`}>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="mb-2 p-1 hover:bg-slate-100 rounded">
                {isMenuOpen ? <Icon path="M15 19l-7-7 7-7" /> : <Icon path="M9 5l7 7-7 7" />}
            </button>
            <div className={isMenuOpen ? 'block' : 'hidden'}>
              <h3 className="font-bold text-slate-700 mb-2">Components</h3>
              <input type="text" placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full px-3 py-2 mb-4 border border-slate-300 rounded-md"/>
              {Object.entries(groupedComponents).map(([category, components]) => (
                  <div key={category} className="mb-4">
                      <h4 className="font-semibold text-sm text-slate-500 mb-2">{category}</h4>
                      <div className="space-y-2">
                          {components.map(c => <div key={c.type} draggable onDragStart={(e) => { e.dataTransfer.setData("application/x-xforms-element-type", c.type); setIsDragging(true); }} onDragEnd={() => setIsDragging(false)} className="flex items-center p-2 bg-slate-100 rounded cursor-grab active:cursor-grabbing">{c.icon} {c.name}</div>)}
                      </div>
                  </div>
              ))}
            </div>
        </div>
        <div className="flex-1">
          <FormRenderer definition={formDefinition} mode="edit" onDrop={handleDrop} isDragging={isDragging} onElementUpdate={handleElementUpdate} onElementDelete={handleElementDelete} onElementRightClick={handleContextMenu} onElementDoubleClick={(element) => setEditingElement(element)} onElementMove={handleElementMove} />
        </div>
      </div>
      <button onClick={() => setIsAiModalOpen(true)} className="fixed bottom-8 right-8 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-transform hover:scale-110">{Icons.ai}</button>
      {isAiModalOpen && <AIModal onClose={() => setIsAiModalOpen(false)} setFormDefinition={setFormDefinition} currentDefinition={formDefinition} />}
      {contextMenu && <ContextMenu x={contextMenu.x} y={contextMenu.y} element={contextMenu.element} onClose={() => setContextMenu(null)} onUpdateDetails={() => setEditingElement(contextMenu.element)} onUpdate={handleElementUpdate} onDelete={handleElementDelete} schema={formDefinition.schema} />}
      {editingElement && <EditElementModal element={editingElement} onClose={() => setEditingElement(null)} onSave={handleElementUpdate} onDelete={handleElementDelete} schema={formDefinition.schema} />}
    </>
  );
};

const EditElementModal: FC<{ element: FormElement; onClose: () => void; onSave: (element: FormElement) => void; onDelete: (elementId: string) => void; schema: FormSchema; }> = ({ element, onClose, onSave, onDelete, schema }) => {
    const [editedElement, setEditedElement] = useState(element);
    const mainLabel = 'label' in editedElement ? 'label' : 'content';
    const [optionsPrompt, setOptionsPrompt] = useState('');
    const [isSuggesting, setIsSuggesting] = useState(false);

    const handleTypeChange = (newType: FormElementType) => {
        const oldElement = editedElement;
        const newElementDefaults = schema[newType]?.defaultProps || {};
        
        const preservedProps = {
            id: oldElement.id,
            subtitle: oldElement.subtitle,
            description: oldElement.description,
            photo: oldElement.photo,
        };

        let newElement: FormElement = {
            ...newElementDefaults,
            ...preservedProps,
            type: newType,
        } as FormElement;

        if ('label' in newElement && 'label' in oldElement) {
            newElement.label = oldElement.label;
        } else if ('content' in newElement && 'content' in oldElement) {
            newElement.content = oldElement.content;
        } else if ('label' in newElement && 'content' in oldElement) {
            newElement.label = oldElement.content;
        } else if ('content' in newElement && 'label' in oldElement) {
            newElement.content = oldElement.label;
        }

        setEditedElement(newElement);
    };
    
    const handleChange = (prop: string, value: string | string[]) => {
        setEditedElement(prev => ({ ...prev, [prop]: value }));
    };

    const handleSave = () => {
        onSave(editedElement);
        onClose();
    };
    
    const handleDelete = () => {
        onDelete(editedElement.id);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 space-y-4">
                <h3 className="text-xl font-bold text-slate-800">Edit Element</h3>
                <div>
                    <label className="text-sm font-medium">Type</label>
                    <select value={editedElement.type} onChange={e => handleTypeChange(e.target.value as FormElementType)} className="w-full p-2 border border-slate-300 rounded-md">
                        {Object.keys(schema).map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                </div>
                <div>
                    <label className="text-sm font-medium">Title / Label</label>
                    <input value={(editedElement as any)[mainLabel] || ''} onChange={e => handleChange(mainLabel, e.target.value)} className="w-full p-2 border border-slate-300 rounded-md"/>
                </div>
                <div>
                    <label className="text-sm font-medium">Subtitle</label>
                    <input value={editedElement.subtitle || ''} onChange={e => handleChange('subtitle', e.target.value)} className="w-full p-2 border border-slate-300 rounded-md"/>
                </div>
                <div>
                    <label className="text-sm font-medium">Description</label>
                    <textarea value={editedElement.description || ''} onChange={e => handleChange('description', e.target.value)} className="w-full p-2 border border-slate-300 rounded-md" rows={3}></textarea>
                </div>
                <div className="flex justify-between items-center">
                    <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700">Delete</button>
                    <div className="flex gap-2">
                        <button onClick={onClose} className="px-4 py-2 bg-slate-200 rounded-md font-semibold">Cancel</button>
                        <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 text-white rounded-md font-semibold">Save</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AIModal: FC<{
    onClose: () => void;
    setFormDefinition: React.Dispatch<React.SetStateAction<FormDefinition>>;
    currentDefinition: FormDefinition;
}> = ({ onClose, setFormDefinition, currentDefinition }) => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAIGenerate = async () => {
        setIsLoading(true);
        setError('');

        const apiKey = "";
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
        
        const systemPrompt = `You are an expert form designer. Your task is to generate the data structure for a form based on a user's prompt. You must only output a valid JSON object that represents the 'data' part of a form definition. The JSON object should have a single key: "sections". "sections" is an array of section objects. Each section has an "id", "title", and "rows". "rows" is an array of row objects. Each row has an "id" and "columns". "columns" is an array of column objects. Each column has an "id", "width" ('full', '1/2'), and an "element". The "element" is an object with "id", "type", and other properties like "label" or "content". For example, if the user asks for a 'name' field, create two 'text' fields for 'First Name' and 'Last Name' in a half-width row. Only output the JSON.`;

        const payload = {
            contents: [{ parts: [{ text: `Prompt: "${prompt}". Create a new form 'data' object based on this prompt.` }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] },
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: "OBJECT",
                    properties: {
                        "sections": { "type": "ARRAY" }
                    }
                }
            }
        };

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error(`API error: ${response.statusText}`);
            
            const result = await response.json();
            const jsonText = result.candidates[0].content.parts[0].text;
            const parsedData = JSON.parse(jsonText);

            if (parsedData.sections) {
                setFormDefinition(prevDef => ({
                    ...prevDef,
                    config: { ...prevDef.config, name: `AI: ${prompt.substring(0, 20)}...` },
                    data: parsedData
                }));
                onClose();
            } else {
                throw new Error("Invalid data structure from AI");
            }
        } catch (e) {
            console.error("Error with Gemini API:", e);
            setError("Failed to generate form. The AI returned an unexpected format.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-4">xForms AI Assistant</h3>
                <p className="text-slate-600 mb-4">Describe the form you want to create from scratch. E.g., "Create a form for webinar interest".</p>
                <textarea value={prompt} onChange={e => setPrompt(e.target.value)} className="w-full p-2 border border-slate-300 rounded-md mb-4" rows={4}></textarea>
                {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 bg-slate-200 rounded-md font-semibold">Cancel</button>
                    <button onClick={handleAIGenerate} disabled={isLoading} className="px-4 py-2 bg-indigo-600 text-white rounded-md font-semibold disabled:bg-indigo-300">{isLoading ? 'Thinking...' : 'Generate Form'}</button>
                </div>
            </div>
        </div>
    );
};

const ListComponent: FC<{ data: SubmittedData[]; onView: (r: SubmittedData) => void; onUpdate: (r: SubmittedData) => void; onDelete: (id: number) => void }> = ({ data, onView, onUpdate, onDelete }) => (
  <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
    <table className="w-full text-left min-w-[600px]">
      <thead><tr className="border-b border-slate-200"><th className="p-3 text-sm font-semibold text-slate-600">ID</th><th className="p-3 text-sm font-semibold text-slate-600">Full Name</th><th className="p-3 text-sm font-semibold text-slate-600">Email</th><th className="p-3 text-sm font-semibold text-slate-600">Session</th><th className="p-3 text-sm font-semibold text-slate-600 text-center">Actions</th></tr></thead>
      <tbody>{data.map(r => (<tr key={r.id} className="border-b border-slate-200 hover:bg-slate-50"><td className="p-3 text-slate-500">{r.id}</td><td className="p-3 font-medium">{`${r.firstName} ${r.lastName}`}</td><td className="p-3">{r.email}</td><td className="p-3">{r.session}</td><td className="p-3"><div className="flex items-center justify-center gap-2"><button onClick={() => onView(r)} className="p-2 text-slate-500 hover:text-blue-600 rounded-full">{Icons.eye}</button><button onClick={() => onUpdate(r)} className="p-2 text-slate-500 hover:text-green-600 rounded-full">{Icons.pencil}</button><button onClick={() => onDelete(r.id)} className="p-2 text-slate-500 hover:text-red-600 rounded-full">{Icons.trash}</button></div></td></tr>))}</tbody>
    </table>
  </div>
);

const ContextMenu: FC<{ x: number, y: number, element: FormElement, onClose: () => void, onUpdateDetails: () => void, onUpdate: (element: FormElement) => void, onDelete: (elementId: string) => void, schema: FormSchema }> = ({ x, y, element, onClose, onUpdateDetails, onUpdate, onDelete, schema }) => {
    const [showChangeType, setShowChangeType] = useState(false);
    const [typeSearch, setTypeSearch] = useState('');

    const handleTypeChange = (newType: FormElementType) => {
        const oldElement = element;
        const newElementDefaults = schema[newType]?.defaultProps || {};
        
        const preservedProps = {
            id: oldElement.id,
            subtitle: oldElement.subtitle,
            description: oldElement.description,
            photo: oldElement.photo,
        };

        let newElement: FormElement = {
            ...newElementDefaults,
            ...preservedProps,
            type: newType,
        } as FormElement;

        if ('label' in newElement && 'label' in oldElement) {
            newElement.label = oldElement.label;
        } else if ('content' in newElement && 'content' in oldElement) {
            newElement.content = oldElement.content;
        } else if ('label' in newElement && 'content' in oldElement) {
            newElement.label = oldElement.content;
        } else if ('content' in newElement && 'label' in oldElement) {
            newElement.content = oldElement.label;
        }
        onUpdate(newElement);
        onClose();
    };

    const filteredTypes = Object.keys(schema).filter(type => type.toLowerCase().includes(typeSearch.toLowerCase()));

    return (
        <>
            <div className="fixed inset-0 z-40" onClick={onClose}></div>
            <div style={{ top: y, left: x }} className="fixed bg-white rounded-md shadow-lg p-2 z-50 w-56">
                <div className="relative">
                    <button className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded" onClick={() => { onUpdateDetails(); onClose(); }}>Update Details</button>
                    <button className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded flex justify-between items-center" onClick={() => setShowChangeType(!showChangeType)}>
                        Change Type <Icon path="M9 5l7 7-7 7" className="h-4 w-4" />
                    </button>
                    {showChangeType && (
                        <div className="absolute left-full top-0 ml-2 bg-white rounded-md shadow-lg p-2 w-56">
                            <input type="text" placeholder="Search type..." value={typeSearch} onChange={e => setTypeSearch(e.target.value)} className="w-full px-2 py-1 mb-2 border border-slate-300 rounded-md" />
                            <div className="max-h-48 overflow-y-auto">
                                {filteredTypes.map(type => (
                                    <button key={type} onClick={() => handleTypeChange(type as FormElementType)} className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded">{type}</button>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="my-1 border-t border-slate-200"></div>
                    <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded" onClick={() => { onDelete(element.id); onClose(); }}>Delete</button>
                </div>
            </div>
        </>
    );
};

// --- MAIN APPLICATION COMPONENT ---
export default function App() {
  const TABS = ['EDITOR', 'FORM JSON', 'ADD', 'LIST', 'VIEW', 'UPDATE', 'FORM DATA JSON'];
  const [activeTab, setActiveTab] = useState('EDITOR');
  const [formDefinition, setFormDefinition] = useState<FormDefinition>(mockFormDefinition);
  const [submittedData, setSubmittedData] = useState<SubmittedData[]>(mockSubmittedData);
  const [selectedRecord, setSelectedRecord] = useState<SubmittedData | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [monacoLoaded, setMonacoLoaded] = useState(false);

  useEffect(() => {
    if (document.getElementById('monaco-loader-script')) {
        if ((window as any).monaco) setMonacoLoaded(true);
        return;
    }
    const script = document.createElement('script');
    script.id = 'monaco-loader-script';
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.33.0/min/vs/loader.min.js';
    script.onload = () => {
      (window as any).require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.33.0/min/vs' }});
      (window as any).require(['vs/editor/editor.main'], () => {
        setMonacoLoaded(true);
      });
    };
    document.body.appendChild(script);
  }, []);

  const handleView = (r: SubmittedData) => { setSelectedRecord(r); setActiveTab('VIEW'); };
  const handleUpdate = (r: SubmittedData) => { setSelectedRecord(r); setActiveTab('UPDATE'); };
  const handleDelete = (id: number) => {
    setSubmittedData(d => d.filter(r => r.id !== id));
    if (selectedRecord?.id === id) {
        setSelectedRecord(null);
        if(['VIEW', 'UPDATE', 'FORM DATA JSON'].includes(activeTab)) setActiveTab('LIST');
    }
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'EDITOR': return <EditorComponent formDefinition={formDefinition} setFormDefinition={setFormDefinition} isDragging={isDragging} setIsDragging={setIsDragging} />;
      case 'FORM JSON': return <JsonViewComponent title="Form Definition JSON" jsonData={formDefinition} monacoLoaded={monacoLoaded}/>;
      case 'ADD': return <FormRenderer definition={formDefinition} mode="add" buttonText="Register for Event" />;
      case 'LIST': return <ListComponent data={submittedData} onView={handleView} onUpdate={handleUpdate} onDelete={handleDelete} />;
      case 'VIEW': return selectedRecord ? <FormRenderer definition={formDefinition} mode="view" initialData={selectedRecord} /> : <div className="text-center p-8 bg-white rounded-lg shadow-md">Select a record from the LIST tab to view it.</div>;
      case 'UPDATE': return selectedRecord ? <FormRenderer definition={formDefinition} mode="update" initialData={selectedRecord} buttonText="Update Registration" /> : <div className="text-center p-8 bg-white rounded-lg shadow-md">Select a record from the LIST tab to update it.</div>;
      case 'FORM DATA JSON': return selectedRecord ? <JsonViewComponent title={`Submitted Data JSON (ID: ${selectedRecord.id})`} jsonData={selectedRecord} monacoLoaded={monacoLoaded}/> : <div className="text-center p-8 bg-white rounded-lg shadow-md">Select a record from the LIST tab to see its JSON data.</div>;
      default: return null;
    }
  };

  return (
    <div className="bg-slate-100 font-sans p-4 sm:p-6 min-h-screen">
      <style>{`body { -webkit-user-select: none; -ms-user-select: none; user-select: none; }`}</style>
      <div id="xforms-drag-data" style={{ display: 'none' }}></div>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6"><div className="border-b border-slate-300 overflow-x-auto"><nav className="-mb-px flex space-x-2 sm:space-x-6">{TABS.map(tab => <button key={tab} onClick={() => setActiveTab(tab)} className={`whitespace-nowrap py-4 px-2 sm:px-3 border-b-2 font-medium text-xs sm:text-sm ${activeTab === tab ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>{tab}</button>)}</nav></div></div>
        <main>{renderActiveTab()}</main>
      </div>
    </div>
  );
}