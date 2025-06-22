'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, FileText, Clock, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface ResearchProject {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'completed' | 'draft';
  lastUpdated: string;
  category: string;
  url: string;
}

const researchProjects: ResearchProject[] = [
  {
    id: 'amanuelpc',
    title: "Amanuel's PC",
    description: 'Comprehensive research and pricing analysis for a modern gaming PC build in South Africa',
    status: 'active',
    lastUpdated: '2024-06-22',
    category: 'Technology',
    url: '/research/amanuelpc'
  },
];

export default function ResearchPage() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Research Dashboard</h1>
          <p className="text-muted-foreground">
            Access and manage ongoing research projects and market analysis
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Search className="h-4 w-4 mr-2" />
            Search Projects
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Projects</p>
                <p className="text-2xl font-bold text-gray-900">{researchProjects.length}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-50">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Projects</p>
                <p className="text-2xl font-bold text-green-600">
                  {researchProjects.filter(p => p.status === 'active').length}
                </p>
              </div>
              <div className="p-3 rounded-full bg-green-50">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Projects</p>
                <p className="text-2xl font-bold text-blue-600">
                  {researchProjects.filter(p => p.status === 'completed').length}
                </p>
              </div>
              <div className="p-3 rounded-full bg-blue-50">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Research Projects Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Research Projects</h2>
        </div>

        <div className="grid gap-6">
          {researchProjects.map((project) => (
            <Card key={project.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg font-semibold">
                      {project.title}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-600">
                      {project.description}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Updated {project.lastUpdated}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                      {project.category}
                    </span>
                  </div>
                  <Link href={project.url}>
                    <Button size="sm" className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4" />
                      View Project
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {researchProjects.length === 0 && (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Research Projects</h3>
                <p className="text-gray-600 mb-4">
                  Start by creating your first research project to track market analysis and insights.
                </p>
                <Button>Create New Project</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick Access Links */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Quick Access</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/research/amanuelpc" className="block">
              <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <h4 className="font-medium text-gray-900">Gaming PC Research</h4>
                <p className="text-sm text-gray-600 mt-1">Latest pricing and component analysis</p>
              </div>
            </Link>
            <div className="p-4 border rounded-lg opacity-50">
              <h4 className="font-medium text-gray-900">Market Trends</h4>
              <p className="text-sm text-gray-600 mt-1">Coming soon...</p>
            </div>
            <div className="p-4 border rounded-lg opacity-50">
              <h4 className="font-medium text-gray-900">Supplier Analysis</h4>
              <p className="text-sm text-gray-600 mt-1">Coming soon...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}