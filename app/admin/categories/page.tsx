'use client'

import { useState, useEffect } from 'react'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  Settings, 
  Plus, 
  ArrowLeft, 
  Edit, 
  Trash2,
  Save,
  X
} from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

interface Category {
  id: string
  name: string
  description?: string
  slug?: string
  created_at: string
  updated_at: string
}

function CategoriesManagementContent() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [newCategory, setNewCategory] = useState({ name: '', description: '', slug: '' })
  const [editForm, setEditForm] = useState({ name: '', description: '', slug: '' })
  const [showNewForm, setShowNewForm] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchCategories()
  }, [])

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name')

      if (error) {
        console.error('Error fetching categories:', error)
        toast({
          title: "Error",
          description: "Failed to fetch categories",
          variant: "destructive",
        })
      } else {
        setCategories(data || [])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      toast({
        title: "Error",
        description: "Failed to fetch categories",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newCategory.name.trim()) {
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive",
      })
      return
    }

    try {
      const { data, error } = await supabase
        .from('categories')
        .insert({
          name: newCategory.name.trim(),
          description: newCategory.description.trim() || null,
          slug: newCategory.slug.trim()
        })
        .select()

      if (error) {
        console.error('Error creating category:', error)
        toast({
          title: "Error",
          description: "Failed to create category",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: "Category created successfully",
        })
        setNewCategory({ name: '', description: '', slug: '' })
        setShowNewForm(false)
        fetchCategories()
      }
    } catch (error) {
      console.error('Error creating category:', error)
      toast({
        title: "Error",
        description: "Failed to create category",
        variant: "destructive",
      })
    }
  }

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!editForm.name.trim() || !editingCategory) {
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive",
      })
      return
    }

    try {
      const { error } = await supabase
        .from('categories')
        .update({
          name: editForm.name.trim(),
          description: editForm.description.trim() || null,
          slug: editForm.slug.trim()
        })
        .eq('id', editingCategory.id)

      if (error) {
        console.error('Error updating category:', error)
        toast({
          title: "Error",
          description: "Failed to update category",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: "Category updated successfully",
        })
        setEditingCategory(null)
        fetchCategories()
      }
    } catch (error) {
      console.error('Error updating category:', error)
      toast({
        title: "Error",
        description: "Failed to update category",
        variant: "destructive",
      })
    }
  }

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      return
    }

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId)

      if (error) {
        console.error('Error deleting category:', error)
        toast({
          title: "Error",
          description: "Failed to delete category",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: "Category deleted successfully",
        })
        fetchCategories()
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      })
    }
  }

  const startEdit = (category: Category) => {
    setEditingCategory(category)
    setEditForm({
      name: category.name,
      description: category.description || '',
      slug: category.slug || ''
    })
  }

  const cancelEdit = () => {
    setEditingCategory(null)
    setEditForm({ name: '', description: '', slug: '' })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading categories...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link href="/admin">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Settings className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900 dark:text-white">Categories</span>
              </div>
            </div>
            <Button onClick={() => setShowNewForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* New Category Form */}
          {showNewForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Add New Category</CardTitle>
                <CardDescription>
                  Create a new product category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateCategory} className="space-y-4">
                  <div>
                    <Label htmlFor="new-name">Category Name *</Label>
                    <Input
                      id="new-name"
                      value={newCategory.name}
                      onChange={(e) => {
                        const name = e.target.value
                        setNewCategory(prev => ({ 
                          ...prev, 
                          name,
                          slug: generateSlug(name)
                        }))
                      }}
                      placeholder="Enter category name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-slug">URL Slug *</Label>
                    <Input
                      id="new-slug"
                      value={newCategory.slug}
                      onChange={(e) => setNewCategory(prev => ({ ...prev, slug: e.target.value }))}
                      placeholder="category-url-slug"
                      required
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Auto-generated from the category name.
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="new-description">Description</Label>
                    <textarea
                      id="new-description"
                      value={newCategory.description}
                      onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Enter category description (optional)"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setShowNewForm(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      <Save className="mr-2 h-4 w-4" />
                      Create Category
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Categories List */}
          {categories.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No categories yet
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Get started by creating your first category.
                </p>
                <Button onClick={() => setShowNewForm(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Category
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {categories.map((category) => (
                <Card key={category.id}>
                  <CardContent className="p-6">
                    {editingCategory?.id === category.id ? (
                      // Edit Form
                      <form onSubmit={handleUpdateCategory} className="space-y-4">
                        <div>
                          <Label htmlFor="edit-name">Category Name *</Label>
                          <Input
                            id="edit-name"
                            value={editForm.name}
                            onChange={(e) => {
                              const name = e.target.value
                              setEditForm(prev => ({ 
                                ...prev, 
                                name,
                                slug: generateSlug(name)
                              }))
                            }}
                            placeholder="Enter category name"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="edit-slug">URL Slug *</Label>
                          <Input
                            id="edit-slug"
                            value={editForm.slug}
                            onChange={(e) => setEditForm(prev => ({ ...prev, slug: e.target.value }))}
                            placeholder="category-url-slug"
                            required
                          />
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Auto-generated from the category name.
                          </p>
                        </div>
                        <div>
                          <Label htmlFor="edit-description">Description</Label>
                          <textarea
                            id="edit-description"
                            value={editForm.description}
                            onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Enter category description (optional)"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                            rows={3}
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button type="button" variant="outline" onClick={cancelEdit}>
                            Cancel
                          </Button>
                          <Button type="submit">
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                          </Button>
                        </div>
                      </form>
                    ) : (
                      // Display Mode
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            {category.name}
                          </h3>
                          {category.description && (
                            <p className="text-gray-600 dark:text-gray-300 mt-1">
                              {category.description}
                            </p>
                          )}
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                            Created: {new Date(category.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => startEdit(category)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteCategory(category.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Status Badge */}
      <div className="fixed bottom-4 right-4">
        <Badge variant="secondary" className="text-sm">
          🛠️ Week 3: Categories
        </Badge>
      </div>
    </div>
  )
}

export default function CategoriesPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <CategoriesManagementContent />
    </ProtectedRoute>
  )
}
