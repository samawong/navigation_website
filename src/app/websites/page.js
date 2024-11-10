'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function WebsiteList() {
  const [websites, setWebsites] = useState([])
  const [error, setError] = useState(null)
  const router = useRouter()

  useEffect(() => {
    fetchWebsites()
  }, [])

  const fetchWebsites = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/websites', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setWebsites(data)
      } else {
        throw new Error('Failed to fetch websites')
      }
    } catch (error) {
      console.error('Error fetching websites:', error)
      setError('Failed to load websites. Please try again.')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this website?')) {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`/api/websites?id=${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (response.ok) {
          setWebsites(websites.filter(website => website.id !== id))
        } else {
          throw new Error('Failed to delete website')
        }
      } catch (error) {
        console.error('Error deleting website:', error)
        setError('Failed to delete website. Please try again.')
      }
    }
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">网站列表</h1>
      <Link href="/websites/add">
        <Button className="mb-4">添加新网站</Button>
      </Link>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>标题</TableHead>
            <TableHead>URL</TableHead>
            <TableHead>分类</TableHead>
            <TableHead>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {websites.map((website) => (
            <TableRow key={website.id}>
              <TableCell>{website.title}</TableCell>
              <TableCell>{website.url}</TableCell>
              <TableCell>{website.category?.name}</TableCell>
              <TableCell>
                <Link href={`/websites/edit/${website.id}`}>
                  <Button variant="outline" className="mr-2">编辑</Button>
                </Link>
                <Button variant="destructive" onClick={() => handleDelete(website.id)}>删除</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}