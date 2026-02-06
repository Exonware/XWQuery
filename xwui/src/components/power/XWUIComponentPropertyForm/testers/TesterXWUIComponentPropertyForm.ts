
        import { XWUITester } from '../../../component/XWUITester/index.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIComponentPropertyForm/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../../';
        
        import { XWUIComponentPropertyForm } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIComponentPropertyForm Component Tester',
            desc: 'Converts JSON schema to editable form. Supports read and write modes. Can read JSON from file/URL.',
            componentName: 'XWUIComponentPropertyForm'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Example schemas
        const userSchema = {
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                    title: 'Full Name',
                    description: 'Enter your full name',
                    minLength: 2,
                    maxLength: 100
                },
                email: {
                    type: 'string',
                    format: 'email',
                    title: 'Email Address',
                    description: 'Your email address'
                },
                age: {
                    type: 'integer',
                    title: 'Age',
                    description: 'Your age',
                    minimum: 0,
                    maximum: 150
                },
                country: {
                    type: 'string',
                    title: 'Country',
                    enum: ['USA', 'Canada', 'UK', 'Germany', 'France', 'Other'],
                    default: 'USA'
                },
                newsletter: {
                    type: 'boolean',
                    title: 'Subscribe to Newsletter',
                    description: 'Receive our monthly newsletter',
                    default: false
                },
                bio: {
                    type: 'string',
                    title: 'Biography',
                    description: 'Tell us about yourself',
                    maxLength: 500
                },
                birthDate: {
                    type: 'string',
                    format: 'date',
                    title: 'Birth Date',
                    description: 'Your date of birth'
                }
            },
            required: ['name', 'email']
        };

        const productSchema = {
            type: 'object',
            properties: {
                title: {
                    type: 'string',
                    title: 'Product Title',
                    minLength: 3,
                    maxLength: 200
                },
                price: {
                    type: 'number',
                    title: 'Price',
                    minimum: 0,
                    description: 'Product price in USD'
                },
                category: {
                    type: 'string',
                    title: 'Category',
                    enum: ['Electronics', 'Clothing', 'Food', 'Books', 'Other']
                },
                inStock: {
                    type: 'boolean',
                    title: 'In Stock',
                    default: true
                },
                description: {
                    type: 'string',
                    title: 'Description',
                    maxLength: 1000
                }
            },
            required: ['title', 'price', 'category']
        };
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuicomponent-property-form-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            // Write mode form - from object
            const formWrite = new XWUIComponentPropertyForm(
                document.getElementById('form-write'),
                {
                    schema,
                    values: {
                        name: 'John Doe',
                        email: 'john@example.com',
                        age: 30,
                        country: 'USA',
                        newsletter: true
                    }
                },
                {
                    mode: 'write',
                    layout: 'vertical',
                    size: 'medium'
                }
            );
            
            formWrite.onChange((values) => {
                document.getElementById('form-write-output').textContent = JSON.stringify(values, null, 2);
            });
            
            // Initial values display
            document.getElementById('form-write-output').textContent = JSON.stringify(formWrite.getValues(), null, 2);
            
            // Read mode form
            const formRead = new XWUIComponentPropertyForm(
                document.getElementById('form-read'),
                {
                    schema,
                    values: {
                        name: 'Jane Smith',
                        email: 'jane@example.com',
                        age: 28,
                        country: 'Canada',
                        newsletter,
                        bio: 'Software developer with 5 years of experience.',
                        birthDate: '1995-06-15'
                    }
                },
                {
                    mode: 'read',
                    layout: 'vertical',
                    size: 'medium'
                }
            );
            
            // Product form
            const formProduct = new XWUIComponentPropertyForm(
                document.getElementById('form-product'),
                {
                    schema,
                    values: {
                        title: 'Sample Product',
                        price: 29.99,
                        category: 'Electronics',
                        inStock,
                        description: 'A great product description here.'
                    }
                },
                {
                    mode: 'write',
                    layout: 'vertical',
                    size: 'medium'
                }
            );
            
            formProduct.onChange((values) => {
                document.getElementById('form-product-output').textContent = JSON.stringify(values, null, 2);
            });
            
            // Initial values display
            document.getElementById('form-product-output').textContent = JSON.stringify(formProduct.getValues(), null, 2);
            
            // Form from JSON string
            const formJsonString = new XWUIComponentPropertyForm(
                document.getElementById('form-json-string'),
                {
                    schema: JSON.stringify(userSchema), // Pass as JSON string
                    values: {
                        name: 'Test User',
                        email: 'test@example.com'
                    }
                },
                {
                    mode: 'write',
                    layout: 'vertical',
                    size: 'medium'
                }
            );
            
            tester.setStatus('✅ XWUIComponentPropertyForm initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIComponentPropertyForm test error:', error);
        }
