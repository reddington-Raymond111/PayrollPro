import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import SalaryStructureForm from '@/components/ui/salary/salary-structure-form';
import ComponentBuilder from '@/components/ui/salary/component-builder';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';
import { format } from 'date-fns';

interface SalaryStructure {
  id: number;
  name: string;
  description: string;
  applicableDepartments: string[];
  effectiveDate: string;
  status: string;
}

interface SalaryComponent {
  id: number;
  structureId: number;
  name: string;
  type: 'fixed' | 'variable' | 'deduction';
  amount?: number;
  formula?: string;
  taxable: boolean;
  description?: string;
}

export default function SalaryConfiguration() {
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedStructure, setSelectedStructure] = useState<SalaryStructure | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [structureToDelete, setStructureToDelete] = useState<number | null>(null);

  // Fetch salary structures
  const { 
    data: structures, 
    isLoading: structuresLoading, 
    refetch: refetchStructures 
  } = useQuery<SalaryStructure[]>({
    queryKey: ['/api/salary-structures'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch components for the selected structure
  const { 
    data: components, 
    isLoading: componentsLoading, 
    refetch: refetchComponents 
  } = useQuery<SalaryComponent[]>({
    queryKey: ['/api/salary-components', selectedStructure?.id],
    staleTime: 1000 * 60 * 5,
    enabled: !!selectedStructure,
  });

  // Create or update structure
  const handleStructureFormSuccess = () => {
    setIsCreateDialogOpen(false);
    setIsEditDialogOpen(false);
    refetchStructures();
    toast({
      title: 'Success',
      description: 'Salary structure has been saved',
    });
  };

  // Delete structure
  const handleDeleteStructure = async () => {
    if (!structureToDelete) return;
    
    try {
      await apiRequest('DELETE', `/api/salary-structures/${structureToDelete}`, undefined);
      
      toast({
        title: 'Structure Deleted',
        description: 'The salary structure has been deleted successfully',
      });
      
      refetchStructures();
      
      if (selectedStructure?.id === structureToDelete) {
        setSelectedStructure(null);
      }
    } catch (error) {
      console.error('Error deleting structure:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete the structure. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setDeleteConfirmOpen(false);
      setStructureToDelete(null);
    }
  };

  // Select a structure to view/edit components
  const handleSelectStructure = (structure: SalaryStructure) => {
    setSelectedStructure(structure);
    // Force refetch components when structure changes
    queryClient.invalidateQueries({ queryKey: ['/api/salary-components', structure.id] });
  };

  // Edit structure
  const handleEditStructure = (structure: SalaryStructure) => {
    setSelectedStructure(structure);
    setIsEditDialogOpen(true);
  };

  // Confirm deletion
  const handleConfirmDelete = (structureId: number) => {
    setStructureToDelete(structureId);
    setDeleteConfirmOpen(true);
  };

  // Handle component changes
  const handleComponentsChanged = () => {
    refetchComponents();
    toast({
      title: 'Components Updated',
      description: 'Salary components have been updated',
    });
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">Salary Structure Configuration</h1>
          <p className="text-neutral-600">Create and manage salary structures for your organization</p>
        </div>
        <Button 
          onClick={() => setIsCreateDialogOpen(true)}
          className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 flex items-center"
        >
          <svg className="mr-1" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          New Structure
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: List of Structures */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-200">
              <h2 className="font-semibold text-lg">Salary Structures</h2>
            </div>
            
            <div className="divide-y divide-neutral-200">
              {structuresLoading ? (
                <div className="p-6 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-2"></div>
                  <p className="text-neutral-600">Loading structures...</p>
                </div>
              ) : structures && structures.length > 0 ? (
                structures.map((structure) => (
                  <div 
                    key={structure.id}
                    className={`p-4 hover:bg-neutral-50 cursor-pointer ${
                      selectedStructure?.id === structure.id ? 'bg-primary-50' : ''
                    }`}
                    onClick={() => handleSelectStructure(structure)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-neutral-800">{structure.name}</h3>
                        <p className="text-sm text-neutral-500">
                          Effective: {format(new Date(structure.effectiveDate), 'MMM dd, yyyy')}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditStructure(structure);
                          }}
                          className="text-neutral-500 hover:text-neutral-700"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleConfirmDelete(structure.id);
                          }}
                          className="text-neutral-500 hover:text-neutral-700"
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
                    <p className="mt-1 text-xs text-neutral-600 line-clamp-2">
                      {structure.description || 'No description provided'}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {structure.applicableDepartments.slice(0, 3).map((dept, index) => (
                        <span 
                          key={index} 
                          className="px-2 py-0.5 bg-neutral-100 text-neutral-700 rounded text-xs"
                        >
                          {dept}
                        </span>
                      ))}
                      {structure.applicableDepartments.length > 3 && (
                        <span className="px-2 py-0.5 bg-neutral-100 text-neutral-700 rounded text-xs">
                          +{structure.applicableDepartments.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center">
                  <p className="text-neutral-600 mb-4">No salary structures found</p>
                  <Button 
                    onClick={() => setIsCreateDialogOpen(true)}
                    variant="outline"
                  >
                    Create your first structure
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Component Builder */}
        <div className="lg:col-span-2">
          {selectedStructure ? (
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-neutral-200">
                <div className="flex justify-between items-center">
                  <h2 className="font-semibold text-lg">Salary Structure Details</h2>
                  <div className="text-sm px-2 py-1 rounded-full bg-neutral-100 text-neutral-700">
                    {selectedStructure.status.charAt(0).toUpperCase() + selectedStructure.status.slice(1)}
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-neutral-800">{selectedStructure.name}</h3>
                  <p className="text-neutral-600 mt-1">{selectedStructure.description || 'No description provided'}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-sm text-neutral-500">Effective Date</p>
                      <p className="font-medium">{format(new Date(selectedStructure.effectiveDate), 'MMMM dd, yyyy')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500">Applicable Departments</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedStructure.applicableDepartments.map((dept, index) => (
                          <span 
                            key={index} 
                            className="px-2 py-0.5 bg-neutral-100 text-neutral-700 rounded text-xs"
                          >
                            {dept}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-2 border-t pt-4">
                  <h3 className="text-base font-medium mb-4">Salary Components</h3>
                  
                  {componentsLoading ? (
                    <div className="text-center py-8">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-2"></div>
                      <p className="text-neutral-600">Loading components...</p>
                    </div>
                  ) : (
                    <ComponentBuilder 
                      structureId={selectedStructure.id}
                      components={components || []}
                      onComponentsChanged={handleComponentsChanged}
                    />
                  )}
                </div>
              </div>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Salary Structure Builder</CardTitle>
                <CardDescription>
                  Select a salary structure from the list or create a new one to get started
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center items-center py-12">
                <svg className="text-neutral-300 mb-4" width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 19.5V4.5C20 3.39543 19.1046 2.5 18 2.5H6C4.89543 2.5 4 3.39543 4 4.5V19.5C4 20.6046 4.89543 21.5 6 21.5H18C19.1046 21.5 20 20.6046 20 19.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M8 6.5H16M8 10.5H16M8 14.5H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <div className="text-center">
                  <h3 className="font-medium text-neutral-800 mb-1">No Structure Selected</h3>
                  <p className="text-neutral-500 mb-4">Select a structure from the list to view and edit its components</p>
                  <Button 
                    onClick={() => setIsCreateDialogOpen(true)}
                    variant="outline"
                  >
                    Create New Structure
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Create Structure Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Salary Structure</DialogTitle>
          </DialogHeader>
          <SalaryStructureForm onSuccess={handleStructureFormSuccess} />
        </DialogContent>
      </Dialog>

      {/* Edit Structure Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Salary Structure</DialogTitle>
          </DialogHeader>
          <SalaryStructureForm 
            onSuccess={handleStructureFormSuccess} 
            existingStructure={selectedStructure || undefined}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this structure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the salary structure
              and all its components.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteStructure} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
