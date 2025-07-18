"use client"
import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { format } from 'date-fns'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../../../components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../../../../components/ui/dialog"
import { Button } from "../../../../components/ui/button"
import { Input } from "../../../../components/ui/input"
import { Badge } from "../../../../components/ui/badge"
import {
    Search,
    MoreVertical,
    Edit,
    Trash2,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Plus
} from "lucide-react"
import Image from 'next/image'
import { deletePartner, getAllPartners } from '../../../../apis/authApis'
import toast from 'react-hot-toast'
// import AddPartner from '@/components/dashboard/AddPartner/AddPartner'
import AddPartner from '../../../../components/dashboard/AddPartner/AddPartner'

export default function ManagePartnerPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchParams.get('search') || '')
    const [pagination, setPagination] = useState({
        currentPage: Number(searchParams.get('page')) || 1,
        totalPages: 0,
        total: 0,
        hasNextPage: false,
        hasPreviousPage: false
    })
    const [partners, setPartners] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [partnerToDelete, setPartnerToDelete] = useState(null)
    const [deleting, setDeleting] = useState(false)
    const itemsPerPage = 8
    const [startIndex, setStartIndex] = useState(0)
    const [addPartnerOpen, setAddPartnerOpen] = useState(false)
    const [selectedPartnerId, setSelectedPartnerId] = useState(null)

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm)
        }, 500)
        return () => clearTimeout(timer)
    }, [searchTerm])

    useEffect(() => {
        if (debouncedSearchTerm !== (searchParams.get('search') || '')) {
            updateURL(debouncedSearchTerm, 1)
            setPagination(prev => ({ ...prev, currentPage: 1 }))
        }
    }, [debouncedSearchTerm])

    useEffect(() => {
        const fetchPartners = async () => {
            try {
                setLoading(true)
                setError(null)
                const page = Number(searchParams.get('page')) || 1
                const search = searchParams.get('search') || ''
                const response = await getAllPartners({
                    page,
                    limit: itemsPerPage,
                    search
                })
                const partnersData = response.data || []
                const total = response.pagination?.total || 0
                const totalPages = Math.ceil(total / itemsPerPage)
                setPartners(partnersData)
                setPagination({
                    currentPage: page,
                    totalPages,
                    total,
                    hasNextPage: page < totalPages,
                    hasPreviousPage: page > 1
                })
                setStartIndex((page - 1) * itemsPerPage)
            } catch (error) {
                console.error('Failed to fetch partners:', error)
                setError(error.message)
                setPartners([])
                setStartIndex(0)
            } finally {
                setLoading(false)
            }
        }
        fetchPartners()
    }, [searchParams])

    function updateURL(search, page) {
        const params = new URLSearchParams()
        if (search) params.set('search', search)
        if (page > 1) params.set('page', page.toString())
        router.push(`?${params.toString() || ''}`, { scroll: false })
    }

    function handleSearchInputChange(value) {
        setSearchTerm(value)
    }

    function handleClearSearch() {
        setSearchTerm('')
        setDebouncedSearchTerm('')
        updateURL('', 1)
        setPagination(prev => ({ ...prev, currentPage: 1 }))
    }

    function changePage(newPage) {
        if (newPage === pagination.currentPage) return
        setPagination(prev => ({ ...prev, currentPage: newPage }))
        updateURL(debouncedSearchTerm, newPage)
    }

    const getPageNumbers = () => {
        const pageNumbers = []
        const maxVisiblePages = 5
        const { currentPage, totalPages } = pagination
        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i)
            }
            return pageNumbers
        }
        pageNumbers.push(1)
        let start = Math.max(2, currentPage - 1)
        let end = Math.min(totalPages - 1, currentPage + 1)
        if (currentPage <= 2) {
            end = 4
        } else if (currentPage >= totalPages - 1) {
            start = totalPages - 3
        }
        if (start > 2) pageNumbers.push('...')
        for (let i = start; i <= end; i++) {
            pageNumbers.push(i)
        }
        if (end < totalPages - 1) pageNumbers.push('...')
        if (totalPages > 1) pageNumbers.push(totalPages)
        return pageNumbers
    }

    const openDeleteModal = (partner) => {
        setPartnerToDelete(partner)
        setDeleteModalOpen(true)
    }

    const handleDelete = async () => {
        if (!partnerToDelete) return
        try {
            setDeleting(true)
            await deletePartner(partnerToDelete.id)
            setPartners(prevPartners => prevPartners.filter(partner => partner.id !== partnerToDelete.id))
            setPagination(prev => ({
                ...prev,
                total: prev.total - 1,
                totalPages: Math.ceil((prev.total - 1) / itemsPerPage)
            }))

            toast.success('Partner deleted successfully')
            setDeleteModalOpen(false)
            setPartnerToDelete(null)
            const remainingItems = partners.length - 1
            if (remainingItems === 0 && pagination.currentPage > 1) {
                changePage(pagination.currentPage - 1)
            }

        } catch (error) {
            console.error('Failed to delete partner:', error)
            toast.error('Failed to delete partner')
        } finally {
            setDeleting(false)
        }
    }

    // refresh partners
    const refreshPartners = async () => {
        try {
            setLoading(true)
            setError(null)
            const page = Number(searchParams.get('page')) || 1
            const search = searchParams.get('search') || ''
            const response = await getAllPartners({
                page,
                limit: itemsPerPage,
                search
            })
            const partnersData = response.data || []
            const total = response.pagination?.total || 0
            const totalPages = Math.ceil(total / itemsPerPage)
            setPartners(partnersData)
            setPagination({
                currentPage: page,
                totalPages,
                total,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1
            })
            setStartIndex((page - 1) * itemsPerPage)
        } catch (error) {
            console.error('Failed to fetch partners:', error)
            setError(error.message)
            setPartners([])
            setStartIndex(0)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-5">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Manage Partners</h1>
                    <p className="text-gray-500 mt-1">View and manage your partners</p>
                </div>

                <Button
                    className="bg-green-600 cursor-pointer hover:bg-green-700 flex items-center gap-2"
                    onClick={() => setAddPartnerOpen(true)}
                >
                    <Plus className="h-4 w-4" />
                    Add Partner
                </Button>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                    <div className="relative flex-1 max-w-md">
                        <div className="flex items-center">
                            <Search className="absolute left-3 text-gray-400 h-4 w-4" />
                            <Input
                                placeholder="Search by name or email..."
                                value={searchTerm}
                                onChange={(e) => handleSearchInputChange(e.target.value)}
                                className="pl-10 bg-gray-50 border-gray-200"
                            />
                            {searchTerm && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleClearSearch}
                                    className="ml-2"
                                >
                                    Clear
                                </Button>
                            )}
                        </div>
                        {/* Show searching indicator */}
                        {searchTerm !== debouncedSearchTerm && (
                            <div className="absolute top-full left-0 mt-1 text-xs text-gray-400 flex items-center gap-1">
                                <div className="w-3 h-3 border border-gray-300 border-t-transparent rounded-full animate-spin" />
                                Searching...
                            </div>
                        )}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50 hover:bg-gray-50">
                                <TableHead className="w-[80px] text-center">Index</TableHead>
                                <TableHead className="w-[200px]">Name</TableHead>
                                <TableHead className="w-[200px]">Email</TableHead>
                                <TableHead className="w-[120px] text-center">Image</TableHead>
                                <TableHead className="w-[120px] text-center">Role</TableHead>
                                <TableHead className="w-[150px] text-center">Created At</TableHead>
                                <TableHead className="w-[100px] text-center">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={7}>
                                        <div className="flex items-center justify-center py-20">
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
                                                <span className="text-gray-500 text-sm">Loading partners...</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : partners.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-10 text-gray-500">
                                        No partners found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                partners.map((partner, index) => (
                                    <TableRow key={partner.id} className="hover:bg-gray-50">
                                        <TableCell className="font-medium text-center">
                                            {startIndex + index + 1}
                                        </TableCell>
                                        <TableCell>
                                            {partner?.name || 'Null'}
                                        </TableCell>
                                        <TableCell>
                                            {partner?.email}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {partner?.image ? (
                                                <div className="relative w-14 h-14 mx-auto">
                                                    <Image
                                                        src={partner?.image}
                                                        width={100}
                                                        height={100}
                                                        alt={partner?.name}
                                                        className="w-full h-full rounded-md object-cover border border-gray-200"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center mx-auto">
                                                    <span className="text-gray-400 text-xs">No image</span>
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge className="font-normal bg-blue-100 text-blue-800">
                                                {partner?.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center text-gray-500">
                                            {format(new Date(partner?.createdAt), 'MMM d, yyyy')}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="cursor-pointer h-8 w-8 p-0">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-[160px]">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        className="cursor-pointer"
                                                        onClick={() => {
                                                            setSelectedPartnerId(partner.id);
                                                            setAddPartnerOpen(true);
                                                        }}
                                                    >
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        <span>Update</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="cursor-pointer text-red-600"
                                                        onClick={() => openDeleteModal(partner)}
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        <span>Delete</span>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-md">
                    {!loading && partners.length > 0 && (
                        <>
                            Showing {startIndex + 1}-
                            {Math.min(pagination.currentPage * itemsPerPage, pagination.total)} of {pagination.total} partners
                        </>
                    )}
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => changePage(1)}
                        disabled={!pagination.hasPreviousPage || loading}
                    >
                        <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => changePage(pagination.currentPage - 1)}
                        disabled={!pagination.hasPreviousPage || loading}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    {getPageNumbers().map((page, index) => (
                        page === '...' ? (
                            <span key={`ellipsis-${index}`} className="px-2">...</span>
                        ) : (
                            <Button
                                key={`page-${page}`}
                                variant={pagination.currentPage === page ? "default" : "outline"}
                                size="icon"
                                className={`h-8 w-8 ${pagination.currentPage === page ? 'bg-green-600 hover:bg-green-700' : ''}`}
                                onClick={() => changePage(page)}
                                disabled={loading}
                            >
                                {page}
                            </Button>
                        )
                    ))}
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => changePage(pagination.currentPage + 1)}
                        disabled={!pagination.hasNextPage || loading}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => changePage(pagination.totalPages)}
                        disabled={!pagination.hasNextPage || loading}
                    >
                        <ChevronsRight className="h-4 w-4" />
                    </Button>
                    <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-md ml-2">
                        Page {pagination.currentPage} of {pagination.totalPages}
                    </div>
                </div>
            </div>

            {/* Delete confirmation modal */}
            <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "{partnerToDelete?.name}"? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex gap-2 mt-4">
                        <Button
                            variant="outline"
                            className="cursor-pointer"
                            onClick={() => setDeleteModalOpen(false)}
                            disabled={deleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={deleting}
                            className="bg-red-600 cursor-pointer hover:bg-red-700"
                        >
                            {deleting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                    Deleting...
                                </>
                            ) : (
                                'Delete'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Add Partner Modal */}
            <AddPartner
                open={addPartnerOpen}
                onOpenChange={(open) => {
                    setAddPartnerOpen(open);
                    if (!open) setSelectedPartnerId(null);
                }}
                onSuccess={refreshPartners}
                partnerId={selectedPartnerId}
            />
        </div>
    )
}