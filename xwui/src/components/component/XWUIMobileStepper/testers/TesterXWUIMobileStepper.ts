import { XWUIMobileStepper } from '../index.ts';
        
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIMobileStepper/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        // Test 1: Dots variant
        let currentStep1 = 0;
        const container1 = document.getElementById('stepper-container-1');
        if (!container1) throw new Error('container1 not found');
        const stepNumber1 = document.getElementById('step-number-1');
        const content1 = document.getElementById('content-1');
        
        const stepper1 = new XWUIMobileStepper(container1, {
            onNext: () => {
                if (currentStep1 < 4) {
                    currentStep1++;
                    stepper1.setActiveStep(currentStep1);
                    if (stepNumber1) stepNumber1.textContent = String(currentStep1 + 1);
                }
            },
            onBack: () => {
                if (currentStep1 > 0) {
                    currentStep1--;
                    stepper1.setActiveStep(currentStep1);
                    if (stepNumber1) stepNumber1.textContent = String(currentStep1 + 1);
                }
            }
        }, {
            variant: 'dots',
            steps: 5,
            activeStep: 0
        });
        
        // Test 2: Progress variant
        let currentStep2 = 0;
        const container2 = document.getElementById('stepper-container-2');
        if (!container2) throw new Error('container2 not found');
        const stepNumber2 = document.getElementById('step-number-2');
        
        const stepper2 = new XWUIMobileStepper(container2, {
            onNext: () => {
                if (currentStep2 < 4) {
                    currentStep2++;
                    stepper2.setActiveStep(currentStep2);
                    if (stepNumber2) stepNumber2.textContent = String(currentStep2 + 1);
                }
            },
            onBack: () => {
                if (currentStep2 > 0) {
                    currentStep2--;
                    stepper2.setActiveStep(currentStep2);
                    if (stepNumber2) stepNumber2.textContent = String(currentStep2 + 1);
                }
            }
        }, {
            variant: 'progress',
            steps: 5,
            activeStep: 0
        });
        
        // Test 3: Text variant
        let currentStep3 = 0;
        const container3 = document.getElementById('stepper-container-3');
        if (!container3) throw new Error('container3 not found');
        const stepNumber3 = document.getElementById('step-number-3');
        
        const stepper3 = new XWUIMobileStepper(container3, {
            onNext: () => {
                if (currentStep3 < 4) {
                    currentStep3++;
                    stepper3.setActiveStep(currentStep3);
                    if (stepNumber3) stepNumber3.textContent = String(currentStep3 + 1);
                }
            },
            onBack: () => {
                if (currentStep3 > 0) {
                    currentStep3--;
                    stepper3.setActiveStep(currentStep3);
                    if (stepNumber3) stepNumber3.textContent = String(currentStep3 + 1);
                }
            }
        }, {
            variant: 'text',
            steps: 5,
            activeStep: 0
        });
        
        // Test 4: Fixed bottom
        let currentStep4 = 0;
        const container4 = document.getElementById('stepper-container-4');
        if (!container4) throw new Error('container4 not found');
        const stepNumber4 = document.getElementById('step-number-4');
        
        const stepper4 = new XWUIMobileStepper(container4, {
            onNext: () => {
                if (currentStep4 < 4) {
                    currentStep4++;
                    stepper4.setActiveStep(currentStep4);
                    if (stepNumber4) stepNumber4.textContent = String(currentStep4 + 1);
                }
            },
            onBack: () => {
                if (currentStep4 > 0) {
                    currentStep4--;
                    stepper4.setActiveStep(currentStep4);
                    if (stepNumber4) stepNumber4.textContent = String(currentStep4 + 1);
                }
            }
        }, {
            variant: 'dots',
            position: 'bottom',
            steps: 5,
            activeStep: 0
        });
