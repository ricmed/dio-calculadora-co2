/**
 * app.js - Main application file
 * Handles initialization and form submission for the CO2 calculator
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // Populate the datalist with all available cities
    CONFIG.populateDatalist();
    
    // Setup automatic distance calculation
    CONFIG.setupDistanceAutofill();
    
    // Get the calculator form element
    const calculatorForm = document.getElementById('calculator-form');
    
    // Add submit event listener
    calculatorForm.addEventListener('submit', handleFormSubmit);
    
    console.log('✅ Calculadora CO₂ inicializada com sucesso!');
    
    function handleFormSubmit(event) {
        event.preventDefault();
        
        // Get form values
        const origin = document.getElementById('origin').value.trim();
        const destination = document.getElementById('destination').value.trim();
        const distanceInput = document.getElementById('distance').value;
        const distance = parseFloat(distanceInput);
        const transportModeInput = document.querySelector('input[name="transport"]:checked');
        const transportMode = transportModeInput ? transportModeInput.value : null;
        
        // Validate inputs
        if (!origin || !destination) {
            alert('❌ Por favor, preencha a origem e o destino.');
            return;
        }
        
        if (!distance || distance <= 0) {
            alert('❌ Por favor, insira uma distância válida maior que zero.');
            return;
        }
        
        if (!transportMode) {
            alert('❌ Por favor, selecione um meio de transporte.');
            return;
        }
        
        // Show loading state
        const submitButton = calculatorForm.querySelector('.form-submit');
        UI.showLoading(submitButton);
        
        // Hide previous results
        UI.hideElement('results');
        UI.hideElement('comparison');
        UI.hideElement('carbon-credits');
        
        // Simulate processing delay
        setTimeout(function() {
            try {
                // Perform calculations
                const emission = Calculator.calculateEmission(distance, transportMode);
                const carEmission = Calculator.calculateEmission(distance, 'car');
                const savings = transportMode !== 'car' 
                    ? Calculator.calculateSavings(emission, carEmission)
                    : null;
                
                const allModesComparison = Calculator.calculateAllModes(distance);
                const carbonCredits = Calculator.calculateCarbonCredits(emission);
                const creditPrice = Calculator.estimateCreditPrice(carbonCredits);
                
                // Build data objects
                const resultsData = {
                    origin: origin,
                    destination: destination,
                    distance: distance,
                    emission: emission,
                    mode: transportMode,
                    savings: savings
                };
                
                const creditsData = {
                    credits: carbonCredits,
                    price: creditPrice
                };
                
                // Render results
                const resultsHTML = UI.renderResults(resultsData);
                document.getElementById('results-content').innerHTML = resultsHTML;
                
                const comparisonHTML = UI.renderComparison(allModesComparison, transportMode);
                document.getElementById('comparison-content').innerHTML = comparisonHTML;
                
                const creditsHTML = UI.renderCarbonCredits(creditsData);
                document.getElementById('carbon-credits-content').innerHTML = creditsHTML;
                
                // Show all result sections
                UI.showElement('results');
                UI.showElement('comparison');
                UI.showElement('carbon-credits');
                
                // Scroll to results
                UI.scrollToElement('results');
                
                // Restore button
                UI.hideLoading(submitButton);
                
                console.log('✅ Cálculo concluído:', {
                    emission: emission,
                    credits: carbonCredits,
                    savings: savings
                });
                
            } catch (error) {
                console.error('❌ Erro ao calcular emissões:', error);
                alert('❌ Ocorreu um erro ao calcular as emissões. Por favor, tente novamente.');
                UI.hideLoading(submitButton);
            }
            
        }, 1500);
    }
    
});
