'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  LogOut, 
  ArrowLeft,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Loader2,
  User,
  Mail,
  Calendar,
  Shield,
  UserCheck,
  UserX
} from 'lucide-react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { supabase } from '@/lib/supabase'

interface UserData {
  id: string
  email: string
  name: string | null
  role: 'admin' | 'customer'
  createdAt: string
  lastSignInAt: string | null
  isActive: boolean
  orderCount: number
  totalSpent: number
}

export default function AdminUsersPage() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<UserData[]>([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const usersPerPage = 10

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
      return
    }

    if (user) {
      // Check if user is admin before fetching users
      checkAdminAndFetch()
    }
  }, [user, loading, router, currentPage, roleFilter])

  const checkAdminAndFetch = async () => {
    try {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('id', user?.id)
        .single()

      if (userError || !userData || userData.role !== 'admin') {
        router.push('/auth/login')
        return
      }

      // User is admin, fetch users
      fetchUsers()
    } catch (error) {
      console.error('Error checking admin status:', error)
      router.push('/auth/login')
    }
  }

  const fetchUsers = async () => {
    setLoadingUsers(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: usersPerPage.toString(),
        ...(roleFilter !== 'all' && { role: roleFilter }),
        ...(searchTerm && { search: searchTerm })
      })

      const response = await fetch(`/api/admin/users?${params}`)
      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }
      const data = await response.json()
      setUsers(data.users || [])
      setTotalPages(Math.ceil(data.total / usersPerPage))
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoadingUsers(false)
    }
  }

  const handleRoleUpdate = async (userId: string, newRole: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      })

      if (!response.ok) {
        throw new Error('Failed to update user role')
      }

      // Refresh users
      fetchUsers()
    } catch (error) {
      console.error('Error updating user role:', error)
    }
  }

  const handleUserStatusUpdate = async (userId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive }),
      })

      if (!response.ok) {
        throw new Error('Failed to update user status')
      }

      // Refresh users
      fetchUsers()
    } catch (error) {
      console.error('Error updating user status:', error)
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'default'
      case 'customer':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
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
                <User className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900 dark:text-white">Users Management</span>
              </div>
            </div>
            <Button onClick={handleSignOut} variant="outline">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filter Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search users by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="customer">Customer</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={fetchUsers}>
                <Filter className="mr-2 h-4 w-4" />
                Apply Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        <Card>
          <CardHeader>
            <CardTitle>Users ({users.length})</CardTitle>
            <CardDescription>
              Manage user accounts and permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingUsers ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mr-2" />
                <span>Loading users...</span>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <User className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>No users found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {users.map((userData) => (
                  <Card key={userData.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                            <User className="h-6 w-6 text-gray-400" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">
                              {userData.name || 'No Name'}
                            </h3>
                            <p className="text-sm text-gray-600 flex items-center">
                              <Mail className="h-4 w-4 mr-1" />
                              {userData.email}
                            </p>
                            <p className="text-sm text-gray-600 flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              Joined {new Date(userData.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right space-y-2">
                          <Badge variant={getRoleBadgeVariant(userData.role)}>
                            <Shield className="h-3 w-3 mr-1" />
                            {userData.role.charAt(0).toUpperCase() + userData.role.slice(1)}
                          </Badge>
                          <div>
                            {userData.isActive ? (
                              <Badge variant="success" className="text-xs">
                                <UserCheck className="h-3 w-3 mr-1" />
                                Active
                              </Badge>
                            ) : (
                              <Badge variant="destructive" className="text-xs">
                                <UserX className="h-3 w-3 mr-1" />
                                Inactive
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <p className="text-2xl font-bold text-blue-600">{userData.orderCount}</p>
                          <p className="text-sm text-gray-600">Orders</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <p className="text-2xl font-bold text-green-600">${userData.totalSpent.toFixed(2)}</p>
                          <p className="text-sm text-gray-600">Total Spent</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <p className="text-2xl font-bold text-purple-600">
                            {userData.lastSignInAt ? 
                              new Date(userData.lastSignInAt).toLocaleDateString() : 
                              'Never'
                            }
                          </p>
                          <p className="text-sm text-gray-600">Last Sign In</p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex space-x-2">
                          <Select
                            value={userData.role}
                            onValueChange={(value) => handleRoleUpdate(userData.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="customer">Customer</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUserStatusUpdate(userData.id, !userData.isActive)}
                          >
                            {userData.isActive ? (
                              <>
                                <UserX className="h-4 w-4 mr-1" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <UserCheck className="h-4 w-4 mr-1" />
                                Activate
                              </>
                            )}
                          </Button>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center space-x-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'default' : 'outline'}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
