import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import * as math from 'mathjs';

interface FormulaEditorProps {
  initialFormula: string;
  onSave: (formula: string) => void;
  onCancel: () => void;
}

export function FormulaEditor({ initialFormula, onSave, onCancel }: FormulaEditorProps) {
  const [formula, setFormula] = useState(initialFormula);
  const [testVariables, setTestVariables] = useState({
    baseSalary: 5000,
    performanceScore: 80,
    grossSalary: 6000
  });
  const [testResult, setTestResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const variables = [
    { name: 'baseSalary', description: 'Base fixed salary of the employee' },
    { name: 'performanceScore', description: 'Performance rating of the employee (0-100)' },
    { name: 'grossSalary', description: 'Total gross salary before deductions' }
  ];

  const functions = [
    { name: 'if(condition, trueValue, falseValue)', description: 'Conditional statement' },
    { name: 'min(a, b)', description: 'Minimum of a and b' },
    { name: 'max(a, b)', description: 'Maximum of a and b' },
    { name: 'round(value)', description: 'Round to nearest integer' },
    { name: 'floor(value)', description: 'Round down to nearest integer' },
    { name: 'ceil(value)', description: 'Round up to nearest integer' }
  ];

  const operators = [
    { symbol: '+', description: 'Addition' },
    { symbol: '-', description: 'Subtraction' },
    { symbol: '*', description: 'Multiplication' },
    { symbol: '/', description: 'Division' },
    { symbol: '%', description: 'Modulo (remainder)' },
    { symbol: '>', description: 'Greater than' },
    { symbol: '<', description: 'Less than' },
    { symbol: '>=', description: 'Greater than or equal to' },
    { symbol: '<=', description: 'Less than or equal to' },
    { symbol: '==', description: 'Equal to' },
    { symbol: '!=', description: 'Not equal to' }
  ];

  useEffect(() => {
    testFormula();
  }, [formula, testVariables]);

  const testFormula = () => {
    if (!formula.trim()) {
      setTestResult(null);
      setError(null);
      return;
    }

    try {
      const result = math.evaluate(formula, testVariables);
      setTestResult(result.toString());
      setError(null);
    } catch (err: any) {
      setTestResult(null);
      setError(err.message);
    }
  };

  const handleInsertVariable = (variable: string) => {
    setFormula(prev => prev + variable);
  };

  const handleInsertOperator = (operator: string) => {
    setFormula(prev => prev + ' ' + operator + ' ');
  };

  const handleInsertFunction = (func: string) => {
    // Extract just the function name without the params
    const funcName = func.split('(')[0];
    setFormula(prev => prev + funcName + '(');
  };

  const handleUpdateTestVariable = (name: string, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setTestVariables(prev => ({
        ...prev,
        [name]: numValue
      }));
    }
  };

  const handleSave = () => {
    if (error) {
      toast({
        title: 'Invalid Formula',
        description: 'Please fix the errors before saving.',
        variant: 'destructive',
      });
      return;
    }

    if (!formula.trim()) {
      toast({
        title: 'Empty Formula',
        description: 'Formula cannot be empty.',
        variant: 'destructive',
      });
      return;
    }

    onSave(formula);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Formula</label>
        <Input
          value={formula}
          onChange={(e) => setFormula(e.target.value)}
          className="font-mono"
          placeholder="Enter your formula here"
        />
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-medium mb-2">Test Variables</h3>
          <div className="space-y-2">
            {variables.map(variable => (
              <div key={variable.name} className="flex space-x-2">
                <div className="w-1/2">
                  <label className="block text-xs">{variable.name}</label>
                </div>
                <Input
                  type="number"
                  value={testVariables[variable.name as keyof typeof testVariables]}
                  onChange={(e) => handleUpdateTestVariable(variable.name, e.target.value)}
                  className="w-1/2 h-8 text-sm"
                />
              </div>
            ))}
          </div>
          
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">Test Result</h3>
            <div className="p-2 bg-neutral-100 rounded-md min-h-[40px] font-mono">
              {testResult !== null ? testResult : error ? 'Error' : 'No result'}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Available Variables</h3>
          <div className="flex flex-wrap gap-1 mb-4">
            {variables.map(variable => (
              <Button
                key={variable.name}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleInsertVariable(variable.name)}
              >
                {variable.name}
              </Button>
            ))}
          </div>

          <h3 className="text-sm font-medium mb-2">Operators</h3>
          <div className="flex flex-wrap gap-1 mb-4">
            {operators.map(op => (
              <Button
                key={op.symbol}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleInsertOperator(op.symbol)}
              >
                {op.symbol}
              </Button>
            ))}
          </div>

          <h3 className="text-sm font-medium mb-2">Functions</h3>
          <div className="flex flex-wrap gap-1">
            {functions.map(func => (
              <Button
                key={func.name}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleInsertFunction(func.name)}
              >
                {func.name.split('(')[0]}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" onClick={handleSave}>
          Save Formula
        </Button>
      </div>
    </div>
  );
}

export default FormulaEditor;
