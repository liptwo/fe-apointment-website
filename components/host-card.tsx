"use client"

import React from "react"
import Link from "next/link"
import { Stethoscope, ArrowRight } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export interface Host {
  id: string
  name: string
  specialty: string
  description: string
}

interface HostCardProps {
  host: Host
}

export function HostCard({ host }: HostCardProps) {
  return (
    <Card className="flex flex-col h-full transition-shadow hover:shadow-md">
      <CardContent className="flex-1 pt-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Stethoscope className="h-6 w-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">{host.name}</h3>
            <Badge variant="secondary" className="mt-1">
              {host.specialty}
            </Badge>
          </div>
        </div>
        <p className="mt-4 text-sm text-muted-foreground line-clamp-3">
          {host.description}
        </p>
      </CardContent>
      <CardFooter className="pt-0">
        <Button asChild className="w-full group">
          <Link href={`/hosts/${host.id}`}>
            View Details
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
