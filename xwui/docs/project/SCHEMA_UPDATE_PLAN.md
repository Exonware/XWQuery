# Schema Update Plan

## Overview
- **Total Components**: 185
- **Missing Schemas**: 100 (need to create from scratch)
- **Existing Schemas**: 85 (need to enhance with name, description, metadata)
- **Total Work**: 185 components to manually review and update

## Schema Format Template

Each schema.json must include:
1. **name**: Component name (string)
2. **description**: Component description (string)
3. **meta**: Metadata object with:
   - **input**: Input rules and properties
   - **output**: Output rules and properties
   - **actions**: Action rules and properties
4. **properties**: Existing component configuration properties

## Example (XWUIActivityFilter - COMPLETED ✓)

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "name": "XWUIActivityFilter",
  "description": "Filter and search activity stream by type, user, date range...",
  "meta": {
    "input": { "description": "...", "rules": [...], "properties": {...} },
    "output": { "description": "...", "rules": [...], "properties": {...} },
    "actions": { "description": "...", "rules": [...], "properties": {...} }
  },
  "properties": { ... }
}
```

## Work Breakdown

### Phase 1: Enhance Existing Schemas (84 remaining)
1. XWUIAlert
2. XWUIApprovalWorkflow
3. XWUIAppShell
4. XWUIAudioEditor
5. XWUIAudioPlayer
6. XWUIAudioRecorder
7. XWUIBottomNavigation
8. XWUIBottomSheet
9. XWUIBulkActionBar
10. XWUIButton
11. XWUICard
12. XWUIChangeDiffViewer
13. XWUIChannelList
14. XWUIChart
15. XWUIChatInput
16. XWUICodeBlock
17. XWUIConsole
18. XWUICopyButton
19. XWUIDataGrid
20. XWUIDebugToolbar
21. XWUIDependencyVisualizer
22. XWUIDiagram
23. XWUIDialog
24. XWUIDiffEditor
25. XWUIDurationPicker
26. XWUIDynamicFieldRenderer
27. XWUIFilePreview
28. XWUIFilters
29. XWUIFocusTrap
30. XWUIFollowIndicator
31. XWUIFormEditor
32. XWUIGalleryEditor
33. XWUIGalleryViewer
34. XWUIGanttChart
35. XWUIHidden
36. XWUIIcon
37. XWUIImage
38. XWUIInput
39. XWUIItem
40. XWUIKanbanBoard
41. XWUILocationInput
42. XWUIMap
43. XWUIMasonry
44. XWUIMediaQuery
45. XWUIMessageBubble
46. XWUIMilestoneMarker
47. XWUINativeSelect
48. XWUINavigationRail
49. XWUIPDFViewer
50. XWUIPhotoEditor
51. XWUIPivotTable
52. XWUIPortfolioDashboard
53. XWUIProgress
54. XWUIProgressBySubtasks
55. XWUIReactionSelector
56. XWUIRecurrencePicker
57. XWUIResizablePanel
58. XWUIResourceAllocationChart
59. XWUIScriptEditor
60. XWUIScrollTo
61. XWUISectionGrouping
62. XWUISignaturePad
63. XWUISkipLink
64. XWUISortableList
65. XWUISplitButton
66. XWUISpreadsheet
67. XWUIStickersOverlay
68. XWUIStyle
69. XWUIStyleSelector
70. XWUISubtaskExpander
71. XWUITable
72. XWUITabs
73. XWUITaskTemplateSelector
74. XWUITextOverlay
75. XWUIThread
76. XWUITimelineZoom
77. XWUITimeTracker
78. XWUITransferList
79. XWUITypingIndicator
80. XWUIVideoEditor
81. XWUIVideoPlayer
82. XWUIVideoRecorder
83. XWUIWorkflow
84. XWUIWorkloadView

### Phase 2: Create Missing Schemas (100 components)
1. Assistant
2. Console
3. DocumentViewer
4. Header
5. Menu
6. Monaco
7. ScriptEditor
8. ScriptStudio
9. Viewer
10. XWINumberInput
11. XWUIAccordion
12. XWUIAffix
13. XWUIAnchor
14. XWUIAppBar
15. XWUIAspectRatio
16. XWUIAutocomplete
17. XWUIAvatar
18. XWUIAvatarGroup
19. XWUIBackToTop
20. XWUIBadge
21. XWUIBox
22. XWUIBreadcrumbs
23. XWUIButtonGroup
24. XWUICalendar
25. XWUICarousel
26. XWUICascader
27. XWUICenter
28. XWUICheckbox
29. XWUIChip
30. XWUICollapse
31. XWUIColorPicker
32. XWUICommand
33. XWUIComponent
34. XWUIContainer
35. XWUIContextMenu
36. XWUIDatePicker
37. XWUIDateRangePicker
38. XWUIDescriptionList
39. XWUIDrawer
40. XWUIDropdownMenu
41. XWUIEmpty
42. XWUIField
43. XWUIFlex
44. XWUIForm
45. XWUIGrid
46. XWUIHoverCard
47. XWUIInputGroup
48. XWUIInputOTP
49. XWUIItemGroup
50. XWUIJsonInput
51. XWUIKbd
52. XWUILabel
53. XWUIList
54. XWUIMentions
55. XWUIMenu
56. XWUIMenubar
57. XWUIMultiSelect
58. XWUINavigationMenu
59. XWUIPagination
60. XWUIPasswordInput
61. XWUIPopconfirm
62. XWUIPopover
63. XWUIPortal
64. XWUIQRCode
65. XWUIRadioGroup
66. XWUIRangeSlider
67. XWUIRating
68. XWUIResizable
69. XWUIResult
70. XWUIRichTextEditor
71. XWUIScrollArea
72. XWUISegmentedControl
73. XWUISelect
74. XWUISeparator
75. XWUISidebar
76. XWUISkeleton
77. XWUISlider
78. XWUISpace
79. XWUISpeedDial
80. XWUISpinner
81. XWUISpoiler
82. XWUIStack
83. XWUIStatistic
84. XWUISteps
85. XWUISwitch
86. XWUITester
87. XWUITextarea
88. XWUITimeline
89. XWUITimePicker
90. XWUIToast
91. XWUIToggleGroup
92. XWUITooltip
93. XWUITour
94. XWUITransition
95. XWUITree
96. XWUITreeSelect
97. XWUITypography
98. XWUIUpload
99. XWUIVisuallyHidden
100. XWUIWatermark

## Process for Each Component

1. **Read Component Source File** (.ts file)
2. **Understand Component Purpose**:
   - What does it do?
   - What inputs does it accept?
   - What outputs does it produce?
   - What actions can users perform?
3. **Check Existing Schema** (if exists):
   - Review current properties
   - Understand configuration options
4. **Create/Update Schema**:
   - Add name and description
   - Add meta.input with rules and properties
   - Add meta.output with rules and properties
   - Add meta.actions with rules and properties
   - Preserve existing properties
5. **Validate JSON**:
   - Ensure valid JSON syntax
   - Check schema structure

## Status

### Completed (10/185 - 5.4%)
- ✅ XWUIActivityFilter
- ✅ XWUIAlert
- ✅ XWUIButton
- ✅ XWUICard
- ✅ XWUIChart
- ✅ XWUIDialog
- ✅ XWUIInput
- ✅ XWUIProgress
- ✅ XWUITabs
- ✅ XWUITable

### Remaining
- ⏳ 75 existing schemas to enhance
- ⏳ 100 missing schemas to create
- **Total Progress**: 10/185 (5.4%)

