import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FormulaEditor } from './formula-editor';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Textarea } from '@/components/ui/textarea';

interface SalaryComponent {
  id: number;
  name: string;
  type: 'fixed' | 'variable' | 'deduction';
  amount?: number;
  formula?: string;
  taxable: boolean;
  description?: string;
}

interface ComponentBuilderProps {
  structureId: number;
  components: SalaryComponent[];
  onComponentsChanged: () => void;
}

// Schema for component validation
const componentSchema = z.object({
  name: z.string().min(1, 'Component name is required'),
  type: z.enum(['fixed', 'variable', 'deduction'], {
    invalid_type_error: 'Please select a valid component type',
  }),
  amount: z.number().optional().nullable(),
  formula: z.string().optional().nullable(),
  taxable: z.boolean().default(true),
  description: z.string().optional().nullable(),
});

type ComponentFormValues = z.infer<typeof componentSchema>;

export function ComponentBuilder({ structureId, components, onComponentsChanged }: ComponentBuilderProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingComponent, setEditingComponent] = useState<SalaryComponent | null>(null);
  const [showFormulaEditor, setShowFormulaEditor] = useState(false);
  const { toast } = useToast();

  const form = useForm<ComponentFormValues>({
    resolver: zodResolver(componentSchema),
    defaultValues: {
      name: '',
      type: 'fixed',
      amount: 0,
      formula: '',
      taxable: true,
      description: '',
    },
  });

  const componentTypeOptions = [
    { value: 'fixed', label: 'Fixed Component' },
    { value: 'variable', label: 'Variable Component' },
    { value: 'deduction', label: 'Deduction' },
  ];

  // Watch the selected type to conditionally show amount or formula field
  const selectedType = form.watch('type');

  const handleAddComponent = () => {
    setEditingComponent(null);
    form.reset({
      name: '',
      type: 'fixed',
      amount: 0,
      formula: '',
      taxable: true,
      description: '',
    });
    setIsDialogOpen(true);
  };

  const handleEditComponent = (component: SalaryComponent) => {
    setEditingComponent(component);
    form.reset({
      ...component,
      amount: component.amount || null,
      formula: component.formula || null,
      description: component.description || '',
    });
    setIsDialogOpen(true);
  };

  const handleDeleteComponent = async (componentId: number) => {
    if (window.confirm('Are you sure you want to delete this component?')) {
      try {
        await apiRequest('DELETE', `/api/salary-components/${componentId}`, undefined);
        toast({
          title: 'Component Deleted',
          description: 'Salary component has been deleted successfully',
        });
        // Refetch the components
        onComponentsChanged();
      } catch (error) {
        console.error('Error deleting component:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete component. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  const onSubmit = async (data: ComponentFormValues) => {
    try {
      // Validate based on type
      if (data.type === 'fixed' && (data.amount === undefined || data.amount === null)) {
        toast({
          title: 'Validation Error',
          description: 'Fixed components must have an amount specified',
          variant: 'destructive',
        });
        return;
      }

      if ((data.type === 'variable' || data.type === 'deduction') && (!data.formula || data.formula.trim() === '')) {
        toast({
          title: 'Validation Error',
          description: `${data.type === 'variable' ? 'Variable components' : 'Deductions'} must have a formula specified`,
          variant: 'destructive',
        });
        return;
      }

      const payload = {
        ...data,
        structureId,
      };

      if (editingComponent) {
        await apiRequest('PUT', `/api/salary-components/${editingComponent.id}`, payload);
        toast({
          title: 'Component Updated',
          description: 'Salary component has been updated successfully',
        });
      } else {
        await apiRequest('POST', '/api/salary-components', payload);
        toast({
          title: 'Component Added',
          description: 'New salary component has been added successfully',
        });
      }

      // Close dialog and refetch components
      setIsDialogOpen(false);
      onComponentsChanged();
    } catch (error) {
      console.error('Error saving component:', error);
      toast({
        title: 'Error',
        description: 'Failed to save component. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleFormulaSet = (formula: string) => {
    form.setValue('formula', formula);
    setShowFormulaEditor(false);
  };

  return (
    <div>
      <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-lg mb-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium">Salary Components</h3>
          <Button
            onClick={handleAddComponent}
            size="sm"
            variant="link"
            className="text-primary-600 text-sm font-medium"
          >
            + Add Component
          </Button>
        </div>

        <div className="space-y-3">
          {components.length === 0 ? (
            <div className="text-center p-6 border border-dashed border-neutral-300 rounded-md">
              <p className="text-neutral-500">No components added yet. Click "Add Component" to create your first salary component.</p>
            </div>
          ) : (
            components.map((component) => (
              <div key={component.id} className="p-3 bg-white border border-neutral-200 rounded-md">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-sm font-medium">{component.name}</span>
                    <span className={`ml-2 px-2 py-0.5 text-xs font-medium ${
                      component.type === 'fixed' 
                        ? 'bg-primary-100 text-primary-700' 
                        : component.type === 'variable'
                        ? 'bg-info/20 text-info'
                        : 'bg-error/20 text-error'
                    } rounded-full`}>
                      {component.type.charAt(0).toUpperCase() + component.type.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      className="text-neutral-500 hover:text-neutral-700"
                      onClick={() => handleEditComponent(component)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <button 
                      className="text-neutral-500 hover:text-neutral-700"
                      onClick={() => handleDeleteComponent(component.id)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M10 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M14 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
                {(component.type === 'variable' || component.type === 'deduction') && component.formula && (
                  <div className="mt-2 text-xs text-neutral-600">
                    <svg className="inline-block mr-1" width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                      <path d="M12 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Formula: {component.formula}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Component Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingComponent ? 'Edit Component' : 'Add New Component'}</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Component Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Base Salary, Performance Bonus" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Component Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select component type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {componentTypeOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {selectedType === 'fixed' && (
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0.00" 
                          step="0.01"
                          {...field}
                          onChange={e => field.onChange(e.target.value === '' ? null : parseFloat(e.target.value))}
                          value={field.value === null || field.value === undefined ? '' : field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              {(selectedType === 'variable' || selectedType === 'deduction') && (
                <FormField
                  control={form.control}
                  name="formula"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Formula</FormLabel>
                      <div className="flex space-x-2">
                        <FormControl>
                          <Input 
                            placeholder="e.g., baseSalary * 0.15" 
                            {...field} 
                            value={field.value || ''}
                          />
                        </FormControl>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setShowFormulaEditor(true)}
                        >
                          Editor
                        </Button>
                      </div>
                      <p className="text-xs text-neutral-500 mt-1">
                        Available variables: baseSalary, performanceScore, grossSalary
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <FormField
                control={form.control}
                name="taxable"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Taxable</FormLabel>
                      <p className="text-sm text-neutral-500">
                        Select if this component is subject to taxation
                      </p>
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Brief description of this component"
                        className="resize-none" 
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingComponent ? 'Update Component' : 'Add Component'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Formula Editor Dialog */}
      <Dialog open={showFormulaEditor} onOpenChange={setShowFormulaEditor}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Formula Editor</DialogTitle>
          </DialogHeader>
          
          <FormulaEditor 
            initialFormula={form.getValues().formula || ''} 
            onSave={handleFormulaSet}
            onCancel={() => setShowFormulaEditor(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ComponentBuilder;
