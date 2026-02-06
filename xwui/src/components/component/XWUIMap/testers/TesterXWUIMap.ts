import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIMap/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIMap } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIMap Component Tester',
            desc: 'Google Maps integration with marker support. Note: Requires Google Maps API key.',
            componentName: 'XWUIMap'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuimap-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            // Basic map (requires API key)
            const basicContainer = document.getElementById('map-basic');
            const basicMap = new XWUIMap(
                basicContainer,
                {},
                {
                    center: { lat: 24.7136, lng: 46.6753 },
                    zoom: 10
                    // apiKey: 'YOUR_API_KEY_HERE' // Set your API key
                }
            );
            
            // Map with markers
            const markersContainer = document.getElementById('map-markers');
            const markersMap = new XWUIMap(
                markersContainer,
                {
                    markers: [
                        { lat: 24.7136, lng: 46.6753 },
                        { lat: 24.7236, lng: 46.6853 }
                    ]
                },
                {
                    center: { lat: 24.7136, lng: 46.6753 },
                    zoom: 12
                    // apiKey: 'YOUR_API_KEY_HERE' // Set your API key
                }
            );
            
            tester.setStatus('✅ XWUIMap initialized (Note)', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIMap test error:', error);
        }
