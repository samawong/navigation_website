import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { authenticateUser } from '@/lib/auth'
import { use } from 'react';
export const GET = async ( request,{params} ) => {

  try {
    const website = await prisma.website.findUnique({
      where: { id: params.id },
      include: { category: true }
    })

    if (!website) {
      return NextResponse.json({ error: 'Website not found' }, { status: 404 })
    }

    return NextResponse.json(website)
  } catch (error) {
    console.error('Error fetching website:', error)
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 })
  }
}

export const PUT = authenticateUser(async (request, { params }) => {
  try {
    const body = await request.json()
    const { title, url, description, icon, categoryId } = body

    const updatedWebsite = await prisma.website.update({
      where: { id: params.id },
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
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 })
  }
})