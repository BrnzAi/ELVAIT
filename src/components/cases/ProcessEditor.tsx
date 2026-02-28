'use client';

import { useState } from 'react';
import { Plus, Trash2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export interface ProcessEntry {
  name: string;
  description: string;
  weight: number;
}

interface ProcessEditorProps {
  processes: ProcessEntry[];
  onChange: (processes: ProcessEntry[]) => void;
}

export default function ProcessEditor({ processes, onChange }: ProcessEditorProps) {
  const [errors, setErrors] = useState<Record<number, string>>({});

  const validateProcesses = (newProcesses: ProcessEntry[]) => {
    const newErrors: Record<number, string> = {};
    const names = newProcesses.map(p => p.name.trim().toLowerCase());
    const totalWeight = newProcesses.reduce((sum, p) => sum + p.weight, 0);

    // Check for duplicate names
    newProcesses.forEach((process, index) => {
      const name = process.name.trim();
      if (!name) {
        newErrors[index] = 'Process name is required';
      } else if (names.filter(n => n === name.toLowerCase()).length > 1) {
        newErrors[index] = 'Process name must be unique';
      } else if (name.length > 80) {
        newErrors[index] = 'Process name must be 80 characters or less';
      }
    });

    // Check weight sum
    if (Math.abs(totalWeight - 100) > 0.1) {
      newErrors[-1] = `Weights must sum to 100% (currently ${totalWeight}%)`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateProcess = (index: number, field: keyof ProcessEntry, value: string | number) => {
    const newProcesses = [...processes];
    newProcesses[index] = { ...newProcesses[index], [field]: value };
    onChange(newProcesses);
    validateProcesses(newProcesses);
  };

  const addProcess = () => {
    if (processes.length >= 5) return;
    
    const newProcesses = [...processes];
    // Auto-rebalance weights equally
    const equalWeight = Math.round(100 / (processes.length + 1));
    const remainingWeight = 100 - (equalWeight * processes.length);
    
    // Update existing processes
    newProcesses.forEach((_, index) => {
      newProcesses[index].weight = equalWeight;
    });
    
    // Add new process with remaining weight
    newProcesses.push({
      name: '',
      description: '',
      weight: remainingWeight
    });
    
    onChange(newProcesses);
    validateProcesses(newProcesses);
  };

  const removeProcess = (index: number) => {
    if (processes.length <= 1) return;
    
    const newProcesses = processes.filter((_, i) => i !== index);
    // Auto-rebalance remaining weights equally
    const equalWeight = Math.round(100 / newProcesses.length);
    const remainder = 100 - (equalWeight * (newProcesses.length - 1));
    
    newProcesses.forEach((_, i) => {
      newProcesses[i].weight = i === 0 ? remainder : equalWeight;
    });
    
    onChange(newProcesses);
    validateProcesses(newProcesses);
  };

  const totalWeight = processes.reduce((sum, p) => sum + p.weight, 0);
  const weightError = Math.abs(totalWeight - 100) > 0.1;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Impacted Processes</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addProcess}
          disabled={processes.length >= 5}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Process {processes.length < 5 && `(${5 - processes.length} more)`}
        </Button>
      </div>
      
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Which processes are affected by this initiative? Each process will be evaluated separately.
      </p>

      {/* Weight sum indicator */}
      <div className={`p-3 rounded-lg border ${
        weightError 
          ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20' 
          : 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
      }`}>
        <div className="flex items-center gap-2">
          {weightError && <AlertCircle className="w-4 h-4 text-red-500" />}
          <span className={`text-sm font-medium ${
            weightError ? 'text-red-700 dark:text-red-300' : 'text-green-700 dark:text-green-300'
          }`}>
            Total Weight: {totalWeight}%
          </span>
        </div>
        {errors[-1] && (
          <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors[-1]}</p>
        )}
      </div>

      <div className="space-y-4">
        {processes.map((process, index) => (
          <div key={index} className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900">
            <div className="flex items-start justify-between mb-3">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Process {index + 1}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeProcess(index)}
                disabled={processes.length <= 1}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 p-1"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid gap-4">
              {/* Name input */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Process Name <span className="text-red-500">*</span>
                  <span className="text-gray-400 font-normal ml-2">({process.name.length}/80)</span>
                </label>
                <Input
                  value={process.name}
                  onChange={(e) => updateProcess(index, 'name', e.target.value)}
                  placeholder="e.g., Order Fulfillment, Customer Onboarding"
                  maxLength={80}
                  className={errors[index] ? 'border-red-500' : ''}
                />
                {errors[index] && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors[index]}</p>
                )}
              </div>

              {/* Description input */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description <span className="text-gray-400 font-normal">(Optional)</span>
                  <span className="text-gray-400 font-normal ml-2">({process.description.length}/200)</span>
                </label>
                <Textarea
                  value={process.description}
                  onChange={(e) => updateProcess(index, 'description', e.target.value)}
                  placeholder="Brief context for participants"
                  rows={2}
                  maxLength={200}
                />
              </div>

              {/* Weight input */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Importance Weight <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={process.weight}
                    onChange={(e) => updateProcess(index, 'weight', parseInt(e.target.value) || 0)}
                    min={1}
                    max={100}
                    className="w-20"
                  />
                  <span className="text-sm text-gray-600">%</span>
                  <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-clarity-600 transition-all"
                      style={{ width: `${process.weight}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {processes.length < 5 && (
        <div className="text-center">
          <Button
            type="button"
            variant="outline"
            onClick={addProcess}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Another Process
          </Button>
        </div>
      )}
    </div>
  );
}