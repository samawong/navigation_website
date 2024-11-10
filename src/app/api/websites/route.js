import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { authenticateUser } from '@/lib/auth'



// 允许所有用户获取网站列表
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (id) {
      const website = await prisma.website.findUnique({
        where: { id },
        include: { category: true }
      })

      if (!website) {
        return NextResponse.json({ error: 'Website not found' }, { status: 404 })
      }

      return NextResponse.json(website)
    } else {
      const websites = await prisma.website.findMany({
        include: { category: true }
      })
      return NextResponse.json(websites)
    }
  } catch (error) {
    console.error('Error fetching website(s):', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
/*
export const GET = authenticateUser(async (request) => {
  try {
    const websites = await prisma.website.findMany({
      include: {
        category: true
      }
    })
    return NextResponse.json(websites)
  } catch (error) {
    console.error('Error fetching websites:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
})
  
  */

export const POST = authenticateUser(async (request) => {
  try {
    const body = await request.json()
    const { title, url, description, icon, categoryId } = body

    const newWebsite = await prisma.website.create({
      data: {
        title,
        url,
        description,
        icon,
        categoryId
      }
    })

    return NextResponse.json(newWebsite, { status: 201 })
  } catch (error) {
    console.error('Error creating website:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
})

export const PUT = authenticateUser(async (request) => {
  try {
    const body = await request.json()
    const { id, title, url, description, icon, categoryId } = body

    const updatedWebsite = await prisma.website.update({
      where: { id },
      data: {
        title,
        url,
        description,
        icon,
        categoryId
      }
    })

    return NextResponse.json(updatedWebsite)
  } catch (error) {
    console.error('Error updating website:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
})

export const DELETE = authenticateUser(async (request) => {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    await prisma.website.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Website deleted successfully' })
  } catch (error) {
    console.error('Error deleting website:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
})