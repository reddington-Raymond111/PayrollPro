import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';

// Extended schema for form validation
const salaryStructureSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  applicableDepartments: z.array(z.string()).min(1, 'At least one department must be selected'),
  effectiveDate: z.string().min(1, 'Effective date is required'),
  status: z.enum(['active', 'inactive']).default('active')
});

type SalaryStructureFormValues = z.infer<typeof salaryStructureSchema>;

interface SalaryStructureFormProps {
  onSuccess?: () => void;
  existingStructure?: {
    id: number;
    name: string;
    description?: string;
    applicableDepartments: string[];
    effectiveDate: string;
    status: string;
  };
}

export function SalaryStructureForm({ onSuccess, existingStructure }: SalaryStructureFormProps) {
  const { toast } = useToast();
  const isEditing = !!existingStructure;

  // Initialize form with defaults or existing values
  const form = useForm<SalaryStructureFormValues>({
    resolver: zodResolver(salaryStructureSchema),
    defaultValues: existingStructure ? {
      ...existingStructure,
      effectiveDate: new Date(existingStructure.effectiveDate).toISOString().split('T')[0]
    } : {
      name: '',
      description: '',
      applicableDepartments: [],
      effectiveDate: new Date().toISOString().split('T')[0],
      status: 'active'
    }
  });

  const departments = [
    'Engineering',
    'Marketing',
    'Sales',
    'Finance',
    'Human Resources',
    'Operations',
    'Customer Support',
    'IT',
    'Legal',
    'Research & Development'
  ];
  
  async function onSubmit(data: SalaryStructureFormValues) {
    try {
      // Format the date to ISO string
      const formattedData = {
        ...data,
        effectiveDate: new Date(data.effectiveDate).toISOString()
      };
      
      if (isEditing) {
        await apiRequest('PUT', `/api/salary-structures/${existingStructure.id}`, formattedData);
        toast({
          title: 'Success',
          description: 'Salary structure updated successfully',
        });
      } else {
        await apiRequest('POST', '/api/salary-structures', formattedData);
        toast({
          title: 'Success',
          description: 'New salary structure created successfully',
        });
      }
      
      // Invalidate the salary structures query to refetch the data
      queryClient.invalidateQueries({ queryKey: ['/api/salary-structures'] });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error saving salary structure:', error);
      toast({
        title: 'Error',
        description: 'Failed to save salary structure. Please try again.',
        variant: 'destructive',
      });
    }
  }

  const handleDepartmentChange = (selectedDept: string) => {
    const currentDepts = form.getValues().applicableDepartments || [];
    if (currentDepts.includes(selectedDept)) {
      form.setValue('applicableDepartments', currentDepts.filter(d => d !== selectedDept));
    } else {
      form.setValue('applicableDepartments', [...currentDepts, selectedDept]);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Structure Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Standard Salary Structure" {...field} />
              </FormControl>
              <FormMessage />
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
                  placeholder="Brief description of this salary structure"
                  className="resize-none" 
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="applicableDepartments"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Applicable Departments</FormLabel>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {departments.map((dept) => (
                  <div key={dept} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`dept-${dept}`}
                      checked={field.value?.includes(dept) || false}
                      onChange={() => handleDepartmentChange(dept)}
                      className="mr-2 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <label htmlFor={`dept-${dept}`} className="text-sm">{dept}</label>
                  </div>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="effectiveDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Effective Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onSuccess}>
            Cancel
          </Button>
          <Button type="submit">
            {isEditing ? 'Update Structure' : 'Save Structure'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default SalaryStructureForm;
