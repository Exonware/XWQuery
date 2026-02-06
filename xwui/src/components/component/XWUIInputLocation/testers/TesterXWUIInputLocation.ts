import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIInputLocation/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIInputLocation } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIInputLocation Component Tester',
            desc: 'Location picker input with map integration. Note: Requires Google Maps API key.',
            componentName: 'XWUIInputLocation'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuiinput-location-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            // Basic
            const basicContainer = document.getElementById('locationinput-basic');
            const basicInput = new XWUIInputLocation(
                basicContainer,
                {},
                {
                    placeholder: 'Enter location or click on map',
                    showMap,
                    mapHeight: '300px'
                    // apiKey: 'YOUR_API_KEY_HERE' // Set your API key
                }
            );
            basicInput.onChange((location, address) => {
                console.log('Location changed:', location, address);
                tester.setStatus(`✅ Location set: ${location.lat}, ${location.lng}`, 'success');
            });
            
            // Without Map
            const noMapContainer = document.getElementById('locationinput-no-map');
            const noMapInput = new XWUIInputLocation(
                noMapContainer,
                {},
                {
                    showMap,
                    placeholder: 'Enter location address'
                }
            );
            
            // Set initial location
            setTimeout(() => {
                basicInput.setLocation({ lat: 24.7136, lng: 46.6753 }, 'Riyadh, Saudi Arabia');
            }, 1000);
            
            tester.setStatus('✅ XWUIInputLocation initialized (Note)', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIInputLocation test error:', error);
        }
