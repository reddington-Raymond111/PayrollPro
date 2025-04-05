import * as math from 'mathjs';

export interface SalaryComponent {
  id: number;
  name: string;
  type: 'fixed' | 'variable' | 'deduction';
  amount?: number | null;
  formula?: string | null;
  taxable: boolean;
}

export interface ComponentOverride {
  componentId: number;
  amount?: number | null;
  formula?: string | null;
}

export interface CalculationResult {
  components: Array<{
    id: number;
    name: string;
    type: string;
    amount?: number;
    calculatedAmount?: number;
    formula?: string;
    taxable: boolean;
  }>;
  deductions: Array<{
    id: number;
    name: string;
    calculatedAmount: number;
    formula?: string;
  }>;
  grossAmount: number;
  netAmount: number;
  totalDeductions: number;
}

// Calculator function to process salary calculation
export function calculateSalary(
  components: SalaryComponent[],
  overrides: ComponentOverride[] = [],
  variables: Record<string, number> = {}
): CalculationResult {
  // Initialize result
  const result: CalculationResult = {
    components: [],
    deductions: [],
    grossAmount: 0,
    netAmount: 0,
    totalDeductions: 0
  };

  // First pass: calculate fixed components
  for (const component of components) {
    // Check if there's an override for this component
    const override = overrides.find(o => o.componentId === component.id);
    
    // Use override values if available
    const amount = override?.amount !== undefined && override?.amount !== null 
      ? override.amount 
      : component.amount;
    
    const formula = override?.formula || component.formula;
    
    if (component.type === 'fixed' && amount !== undefined && amount !== null) {
      result.grossAmount += amount;
      result.components.push({
        id: component.id,
        name: component.name,
        type: component.type,
        amount,
        taxable: component.taxable
      });
    }
  }

  // Prepare scope for formula evaluation
  const baseSalaryComponent = result.components.find(c => c.name.toLowerCase().includes('base salary'));
  
  const scope: Record<string, any> = {
    ...variables,
    baseSalary: baseSalaryComponent?.amount || 0,
    grossSalary: result.grossAmount
  };

  // Second pass: calculate variable components using the scope
  for (const component of components) {
    // Check if there's an override for this component
    const override = overrides.find(o => o.componentId === component.id);
    const formula = override?.formula || component.formula;
    
    if ((component.type === 'variable' || component.type === 'deduction') && formula) {
      try {
        const calculatedAmount = math.evaluate(formula, scope);
        
        if (component.type === 'variable') {
          result.grossAmount += calculatedAmount;
          result.components.push({
            id: component.id,
            name: component.name,
            type: component.type,
            calculatedAmount,
            formula,
            taxable: component.taxable
          });
        } else if (component.type === 'deduction') {
          result.totalDeductions += calculatedAmount;
          result.deductions.push({
            id: component.id,
            name: component.name,
            calculatedAmount,
            formula
          });
        }
        
        // Update scope for next calculations
        scope.grossSalary = result.grossAmount;
        scope[component.name.toLowerCase().replace(/\s+/g, '_')] = calculatedAmount;
      } catch (err) {
        console.error(`Error calculating formula for component ${component.name}:`, err);
        // Add component with error
        if (component.type === 'variable') {
          result.components.push({
            id: component.id,
            name: component.name,
            type: component.type,
            calculatedAmount: 0,
            formula,
            taxable: component.taxable
          });
        } else if (component.type === 'deduction') {
          result.deductions.push({
            id: component.id,
            name: component.name,
            calculatedAmount: 0,
            formula
          });
        }
      }
    }
  }

  // Calculate net amount
  result.netAmount = result.grossAmount - result.totalDeductions;
  
  return result;
}

// Function to validate a formula
export function validateFormula(formula: string): { valid: boolean, error?: string } {
  if (!formula.trim()) {
    return { valid: false, error: 'Formula cannot be empty' };
  }
  
  try {
    // Sample scope for validation
    const scope = {
      baseSalary: 5000,
      performanceScore: 80,
      grossSalary: 6000
    };
    
    math.evaluate(formula, scope);
    return { valid: true };
  } catch (err: any) {
    return { valid: false, error: err.message };
  }
}

// Function to calculate tax based on tax brackets
export function calculateTax(grossAmount: number, taxRates: any[]): number {
  if (!taxRates || taxRates.length === 0) {
    return 0;
  }
  
  // Sort tax rates by thresholdLower in ascending order
  const sortedRates = [...taxRates].sort((a, b) => {
    const lowerA = a.thresholdLower === null || a.thresholdLower === undefined ? 0 : a.thresholdLower;
    const lowerB = b.thresholdLower === null || b.thresholdLower === undefined ? 0 : b.thresholdLower;
    return lowerA - lowerB;
  });
  
  let tax = 0;
  let remainingAmount = grossAmount;
  
  for (let i = 0; i < sortedRates.length; i++) {
    const rate = sortedRates[i];
    const nextRate = sortedRates[i + 1];
    
    const lowerThreshold = rate.thresholdLower !== null && rate.thresholdLower !== undefined ? rate.thresholdLower : 0;
    const upperThreshold = rate.thresholdUpper !== null && rate.thresholdUpper !== undefined 
      ? rate.thresholdUpper 
      : nextRate?.thresholdLower !== null && nextRate?.thresholdLower !== undefined 
        ? nextRate.thresholdLower - 0.01
        : Infinity;
    
    if (grossAmount <= lowerThreshold) {
      break;
    }
    
    if (grossAmount > lowerThreshold) {
      const taxableInBracket = Math.min(remainingAmount, upperThreshold - lowerThreshold);
      tax += taxableInBracket * rate.rate;
      remainingAmount -= taxableInBracket;
      
      if (remainingAmount <= 0) {
        break;
      }
    }
  }
  
  return tax;
}
