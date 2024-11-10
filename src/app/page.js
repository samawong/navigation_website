'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Seo from '@/components/Seo'
import Script from 'next/script'
import { UserCircle, LogOut, Menu, ChevronLeft, ChevronRight } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
export default function NavigationPage() {
  const [categories, setCategories] = useState([])
  const [websites, setWebsites] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [username, setUsername] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchCategories()
    fetchWebsites()
    checkLoginStatus()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      } else {
        console.error('Failed to fetch categories')
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchWebsites = async () => {
    try {
      const response = await fetch('/api/websites')
      if (response.ok) {
        const data = await response.json()
        setWebsites(data)
      } else {
        console.error('Failed to fetch websites')
      }
    } catch (error) {
      console.error('Error fetching websites:', error)
    }
  }

  const checkLoginStatus = () => {
    const token = localStorage.getItem('token')
    const storedUsername = localStorage.getItem('email')
    if (token && storedUsername) {
      setIsLoggedIn(true)
      setUsername(storedUsername)
    } else {
      setIsLoggedIn(false)
      setUsername('')
    }
  }

  const handleCategoryClick = (category) => {
    setSelectedCategory(category)
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const filteredWebsites = websites.filter((website) => {
    const matchesCategory = !selectedCategory || website.categoryId === selectedCategory.id
    const matchesSearch = website.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      website.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    setIsLoggedIn(false)
    setUsername('')
    router.push('/')
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "我的导航网站",
    "url": "https://your-domain.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://your-domain.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  return (
    <>
      <Seo
        title="首页"
        description="发现和组织您最喜爱的网站。我们的导航网站提供分类浏览和搜索功能，帮助您轻松找到所需的在线资源。"
        canonical="https://your-domain.com"
      />
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="flex flex-col  min-h-screen">
        {/* 顶部导航栏 */}
        <header className="bg-primary text-primary-foreground p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">我的导航网站</h1>
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <span className="hidden md:flex items-center">
                  <UserCircle className="mr-2" />
                  {username}
                </span>
                <Button variant="secondary" size="sm" onClick={handleLogout}>
                  <LogOut className="mr-2" />
                  <span className='hidden md:inline'>
                    退出
                  </span>
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button variant="secondary" size="sm">登录</Button>
              </Link>
            )}
          </div>
        </header>

       {/* Main content */}
       <div className="flex flex-1 overflow-hidden">
        {/* Mobile menu */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden fixed bottom-4 left-4 z-50">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[250px] sm:w-[300px]">
            <div className="py-4">
              <h2 className="text-xl font-bold mb-4">分类</h2>
              
              <ul>
              {categories.map((category) => (
                <li
                  key={category.id}
                  className={`cursor-pointer p-2 hover:bg-gray-200 ${selectedCategory?.id === category.id ? 'bg-gray-300' : ''
                    }`}
                  onClick={() => handleCategoryClick(category)}
                >
                  {category.name}
                </li>
              ))}
            </ul>
              {isLoggedIn && (
                <>
                  <Link href="/websites">
                    <Button className="mt-4 w-full">管理网站</Button>
                  </Link>
                  <Link href="/categories">
                    <Button className="mt-4 w-full">管理分类</Button>
                  </Link>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>

        {/* Desktop sidebar */}
        <div className={`hidden md:flex flex-col ${isSidebarCollapsed ? 'w-16' : 'w-64'} bg-gray-100 p-4 transition-all duration-300 ease-in-out`}>
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="self-end mb-4"
          >
            {isSidebarCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </Button>
          {!isSidebarCollapsed && (
            <>
          <h2 className="text-xl font-bold mb-4">分类</h2>
          <ul>
              {categories.map((category) => (
                <li
                  key={category.id}
                  className={`cursor-pointer p-2 hover:bg-gray-200 ${selectedCategory?.id === category.id ? 'bg-gray-300' : ''
                    }`}
                  onClick={() => handleCategoryClick(category)}
                >
                  {category.name}
                </li>
              ))}
            </ul>
          {isLoggedIn && (
            <>
              <Link href="/websites">
                <Button className="mt-4 w-full">管理网站</Button>
              </Link>
              <Link href="/categories">
                <Button className="mt-4 w-full">管理分类</Button>
              </Link>
            </>
          )}
          </>
          )}
        </div>

          {/* 右侧网站列表 */}
          <div className="flex-1 p-4">
            <div className="mb-4">
              <Input
                type="text"
                placeholder="搜索网站..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredWebsites.map((website) => (
                <Card key={website.id}>
                  <CardHeader>
                    <CardTitle>{website.title}</CardTitle>
                    <CardDescription>{website.url}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>{website.description}</p>
                  </CardContent>
                  <CardFooter>
                    <a href={website.url} target="_blank" rel="noopener noreferrer">
                      <Button>访问网站</Button>
                    </a>
                    {isLoggedIn && (
                      <Link href={`/websites/edit/${website.id}`}>
                        <Button variant="outline" className="ml-2">编辑</Button>
                      </Link>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}