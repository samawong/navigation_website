import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { authenticateUser } from '@/lib/auth'

// 允许所有用户获取分类列表
export async function GET(request) {
    try {
      const categories = await prisma.category.findMany({
        include: {
          websites: true
        }
      })
      return NextResponse.json(categories)
    } catch (error) {
      console.error('Error fetching categories:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
  }
  


export const POST = authenticateUser(async (request) => {
  try {
    const body = await request.json()
    const { name } = body

    const newCategory = await prisma.category.create({
      data: { name }
    })

    return NextResponse.json(newCategory, { status: 201 })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
})

export const PUT = authenticateUser(async (request) => {
  try {
    const body = await request.json()
    const { id, name } = body

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: { name }
    })

    return NextResponse.json(updatedCategory)
  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
})

export const DELETE = authenticateUser(async (request) => {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    await prisma.category.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Category deleted successfully' })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
})