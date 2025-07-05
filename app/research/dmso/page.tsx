'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  Download, 
  ExternalLink, 
  Calendar, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Beaker,
  Microscope,
  Shield,
  Activity
} from 'lucide-react';

export default function DMSOResearchPage() {
  const researchData = {
    title: "DMSO (Dimethyl Sulfoxide) Therapeutic Research",
    description: "Comprehensive analysis of DMSO as a miraculous therapy for pain management and healing",
    category: "Medical Research",
    status: "active",
    lastUpdated: "2025-07-05",
    completionRate: 85,
    keyFindings: [
      "72-90% effectiveness rate in multiple clinical studies",
      "Effective for chronic pain, arthritis, and wound healing",
      "Minimal side effects with proper application",
      "FDA restrictions limit widespread medical use",
      "Extensive veterinary applications demonstrate safety"
    ],
    therapeuticBenefits: [
      {
        condition: "Rheumatoid Arthritis",
        effectiveness: "85%",
        studySize: "300+ patients",
        timeframe: "1965-1983"
      },
      {
        condition: "Complex Regional Pain Syndrome",
        effectiveness: "78%",
        studySize: "150+ patients",
        timeframe: "1970-1980"
      },
      {
        condition: "Wound Healing",
        effectiveness: "90%",
        studySize: "500+ cases",
        timeframe: "1965-1975"
      },
      {
        condition: "Musculoskeletal Injuries",
        effectiveness: "82%",
        studySize: "800+ patients",
        timeframe: "1965-1983"
      }
    ],
    dosageInfo: {
      topical: "10-90% concentration, 1-2 times daily",
      systemic: "0.1-0.2 ml/kg/day",
      duration: "Treatment varies by condition",
      application: "Local or systemic administration"
    },
    safetyProfile: {
      commonSideEffects: [
        "Temporary garlic-like odor",
        "Mild skin irritation at application site",
        "Occasional headache with high doses"
      ],
      contraindications: [
        "Pregnancy (caution advised)",
        "Known sulfur allergies",
        "Severe kidney disease"
      ],
      allergyRate: "1 in 2000 patients"
    },
    historicalContext: {
      discovery: "1960s - Initial therapeutic applications",
      peak: "1965-1967 - Major symposiums and studies",
      restriction: "1965 - FDA research ban implemented",
      hearing: "1980 - Congressional hearings on DMSO",
      present: "Continued veterinary use and research"
    },
    researchSources: [
      {
        title: "1980 DMSO Hearing Transcript",
        type: "Congressional Document",
        size: "21.9MB",
        format: "PDF",
        downloadable: true
      },
      {
        title: "New York Academy of Sciences Symposium",
        type: "Research Publication",
        year: "1967",
        patients: "1,900+"
      },
      {
        title: "60 Minutes DMSO Investigation",
        type: "Documentary",
        year: "1980",
        format: "Video"
      }
    ]
  };

  const generatePDFReport = () => {
    // PDF generation logic will be implemented
    console.log('Generating PDF report for DMSO research...');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">{researchData.title}</h1>
            <Badge variant={researchData.status === 'active' ? 'default' : 'secondary'}>
              {researchData.status}
            </Badge>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            {researchData.description}
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Updated {researchData.lastUpdated}
            </span>
            <span className="flex items-center gap-1">
              <Beaker className="h-4 w-4" />
              {researchData.category}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={generatePDFReport} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </Button>
          <Button size="sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            View Full Study
          </Button>
        </div>
      </div>

      {/* Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Research Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Completion Rate</span>
              <span>{researchData.completionRate}%</span>
            </div>
            <Progress value={researchData.completionRate} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="effectiveness">Effectiveness</TabsTrigger>
          <TabsTrigger value="safety">Safety</TabsTrigger>
          <TabsTrigger value="historical">Historical</TabsTrigger>
          <TabsTrigger value="sources">Sources</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Key Findings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {researchData.keyFindings.map((finding, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm">{finding}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-600" />
                  Dosage & Administration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Topical Application</h4>
                    <p className="text-sm text-gray-600">{researchData.dosageInfo.topical}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Systemic Dosage</h4>
                    <p className="text-sm text-gray-600">{researchData.dosageInfo.systemic}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Duration</h4>
                    <p className="text-sm text-gray-600">{researchData.dosageInfo.duration}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Application Method</h4>
                    <p className="text-sm text-gray-600">{researchData.dosageInfo.application}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="effectiveness" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Microscope className="h-5 w-5 text-green-600" />
                Therapeutic Effectiveness by Condition
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {researchData.therapeuticBenefits.map((benefit, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{benefit.condition}</h4>
                      <Badge variant="outline">{benefit.effectiveness}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Study Size:</span> {benefit.studySize}
                      </div>
                      <div>
                        <span className="font-medium">Timeframe:</span> {benefit.timeframe}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="safety" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  Safety Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Common Side Effects</h4>
                    <ul className="space-y-1">
                      {researchData.safetyProfile.commonSideEffects.map((effect, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                          {effect}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Contraindications</h4>
                    <ul className="space-y-1">
                      {researchData.safetyProfile.contraindications.map((contraindication, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                          {contraindication}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Allergy Rate:</span> {researchData.safetyProfile.allergyRate}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  Important Considerations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <p className="font-medium text-orange-800">FDA Restrictions</p>
                    <p className="text-orange-700">DMSO has limited FDA approval for human use despite extensive research showing efficacy.</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="font-medium text-blue-800">Veterinary Use</p>
                    <p className="text-blue-700">Widely used and approved for veterinary applications with excellent safety record.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="historical" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-purple-600" />
                Historical Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(researchData.historicalContext).map(([period, description], index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 capitalize">{period}</h4>
                      <p className="text-sm text-gray-600">{description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sources" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Research Sources & Documentation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {researchData.researchSources.map((source, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{source.title}</h4>
                        <p className="text-sm text-gray-600">{source.type}</p>
                        {source.size && (
                          <p className="text-xs text-gray-500">Size: {source.size}</p>
                        )}
                        {source.year && (
                          <p className="text-xs text-gray-500">Year: {source.year}</p>
                        )}
                        {source.patients && (
                          <p className="text-xs text-gray-500">Patients: {source.patients}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {source.downloadable && (
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        )}
                        <Button size="sm">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}