'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Fingerprint, 
  Network, 
  Code, 
  Clock, 
  Users, 
  Database,
  Smartphone,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';

export default function BioLiteN2ResearchPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">BioLite N2 Integration Research</h1>
        </div>
        <p className="text-muted-foreground max-w-3xl">
          Comprehensive research on integrating Suprema BioLite N2 biometric devices with Python and JavaScript 
          for employee time tracking and attendance management systems.
        </p>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="h-4 w-4" />
          Last updated: July 1, 2025
        </div>
      </div>

      {/* Device Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Fingerprint className="h-5 w-5 text-blue-600" />
            <CardTitle>Suprema BioLite N2 Overview</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            The BioLite N2 is Suprema's 2nd generation outdoor fingerprint terminal that provides comprehensive 
            access control and time attendance features with IP67-rated protection for harsh outdoor environments.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-900">User Capacity</span>
              </div>
              <p className="text-2xl font-bold text-blue-900">10,000</p>
              <p className="text-sm text-blue-700">Users (20K fingerprints)</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Database className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-900">Log Capacity</span>
              </div>
              <p className="text-2xl font-bold text-green-900">1M</p>
              <p className="text-sm text-green-700">Event logs</p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Network className="h-4 w-4 text-purple-600" />
                <span className="font-medium text-purple-900">CPU Speed</span>
              </div>
              <p className="text-2xl font-bold text-purple-900">1.2GHz</p>
              <p className="text-sm text-purple-700">ARM Processor</p>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-orange-600" />
                <span className="font-medium text-orange-900">Protection</span>
              </div>
              <p className="text-2xl font-bold text-orange-900">IP67</p>
              <p className="text-sm text-orange-700">Outdoor rated</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Technical Specs</TabsTrigger>
          <TabsTrigger value="python">Python Integration</TabsTrigger>
          <TabsTrigger value="javascript">JavaScript/Node.js</TabsTrigger>
          <TabsTrigger value="api">API Documentation</TabsTrigger>
          <TabsTrigger value="implementation">Implementation Guide</TabsTrigger>
        </TabsList>

        {/* Technical Specifications */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="h-5 w-5" />
                  Communication Interfaces
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Network Connectivity</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        TCP/IP Ethernet (10/100 Mbps)
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        RS-485 (Master/Slave, OSDP V2)
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Wiegand Input/Output
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Authentication Methods</h4>
                    <div className="space-y-2">
                      <Badge variant="secondary" className="mr-2">Fingerprint</Badge>
                      <Badge variant="secondary" className="mr-2">RFID Cards</Badge>
                      <Badge variant="secondary" className="mr-2">PIN Codes</Badge>
                      <Badge variant="secondary" className="mr-2">Mobile NFC/BLE</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  RFID & Mobile Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Low Frequency (125kHz)</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• EM Cards</li>
                      <li>• HID Prox Cards</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">High Frequency (13.56MHz)</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• MIFARE Classic/Plus</li>
                      <li>• DESFire/EV1</li>
                      <li>• FeliCa, iCLASS</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Mobile Access</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• NFC</li>
                      <li>• Bluetooth LE (BLE)</li>
                      <li>• Mobile Apps</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Python Integration */}
        <TabsContent value="python" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Python Integration Options
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-lg mb-2">1. Suprema G-SDK (Recommended)</h3>
                  <p className="text-gray-600 mb-3">
                    Modern gRPC-based SDK with Python support for real-time device communication.
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Installation</h4>
                    <code className="bg-gray-800 text-green-400 p-2 rounded block text-sm">
                      pip install biostarPython
                    </code>
                  </div>
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Key Features</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Real-time event monitoring</li>
                      <li>• User enrollment and management</li>
                      <li>• Time & Attendance APIs</li>
                      <li>• Device configuration</li>
                      <li>• Log retrieval with filters</li>
                    </ul>
                  </div>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-lg mb-2">2. BioStar 2 REST API</h3>
                  <p className="text-gray-600 mb-3">
                    JSON-based REST API for web-based integrations and cloud deployments.
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Basic Connection</h4>
                    <pre className="bg-gray-800 text-green-400 p-2 rounded text-sm overflow-x-auto">
{`import requests
import json

# API Login
login_data = {
    "User": {"login_id": "admin", "password": "password"}
}
response = requests.post(
    "https://device-ip/api/login", 
    json=login_data
)
session_id = response.json()['session_id']`}
                    </pre>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Python Code Examples</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Employee Sign-In/Out Tracking</h4>
                  <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`from biostarPython import GatewayClient, ConnectSvc, EventSvc
import datetime

class EmployeeTimeTracker:
    def __init__(self, gateway_ip, gateway_port):
        self.client = GatewayClient(gateway_ip, gateway_port, 'ca.crt')
        self.channel = self.client.getChannel()
        self.event_svc = EventSvc(self.channel)
        
    def monitor_attendance(self):
        """Monitor real-time attendance events"""
        def handle_event(event):
            employee_id = event.user_id
            timestamp = datetime.fromtimestamp(event.datetime)
            event_type = "Sign In" if event.event_code == 0x1000 else "Sign Out"
            
            print(f"Employee {employee_id}: {event_type} at {timestamp}")
            self.log_attendance(employee_id, event_type, timestamp)
            
        self.event_svc.subscribe(handle_event)
    
    def log_attendance(self, employee_id, event_type, timestamp):
        """Log attendance to database or file"""
        # Your database logging logic here
        pass`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* JavaScript Integration */}
        <TabsContent value="javascript" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                JavaScript/Node.js Integration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-l-4 border-yellow-500 pl-4">
                <h3 className="font-semibold text-lg mb-2">Suprema G-SDK for Node.js</h3>
                <p className="text-gray-600 mb-3">
                  Official G-SDK client library with comprehensive Node.js support.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Installation & Setup</h4>
                  <pre className="bg-gray-800 text-green-400 p-2 rounded text-sm">
{`npm install @supremainc/g-sdk
# or download from GitHub releases`}
                  </pre>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Employee Time Tracking System</h4>
                <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`const { GatewayClient, ConnectSvc, EventSvc, UserSvc } = require('@supremainc/g-sdk');

class BioLiteTimeSystem {
    constructor(gatewayIP, gatewayPort) {
        this.client = new GatewayClient(gatewayIP, gatewayPort, 'ca.crt');
        this.channel = this.client.getChannel();
        this.eventSvc = new EventSvc(this.channel);
        this.userSvc = new UserSvc(this.channel);
    }

    async enrollEmployee(employeeData) {
        const userInfo = {
            ID: employeeData.id,
            name: employeeData.name,
            startTime: Date.now(),
            endTime: Date.now() + (365 * 24 * 60 * 60 * 1000) // 1 year
        };
        
        return await this.userSvc.enroll(userInfo);
    }

    startAttendanceMonitoring() {
        this.eventSvc.subscribe((event) => {
            const attendance = {
                employeeId: event.userID,
                timestamp: new Date(event.datetime * 1000),
                eventType: this.getEventType(event.eventCode),
                deviceId: event.deviceID
            };
            
            this.processAttendance(attendance);
        });
    }

    getEventType(eventCode) {
        const eventTypes = {
            0x1000: 'ENTRY',
            0x2000: 'EXIT',
            0x4000: 'DENIED'
        };
        return eventTypes[eventCode] || 'UNKNOWN';
    }

    async processAttendance(attendance) {
        // Save to database
        console.log('Attendance recorded:', attendance);
        
        // Trigger webhooks or notifications
        await this.notifyAttendance(attendance);
    }

    async notifyAttendance(attendance) {
        // Send real-time notifications
        // Update dashboard
        // Generate reports
    }
}

// Usage
const timeSystem = new BioLiteTimeSystem('192.168.1.100', 4000);
timeSystem.startAttendanceMonitoring();`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Documentation */}
        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Integration Methods</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline">G-SDK</Badge>
                    <h3 className="font-semibold">gRPC-based SDK</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Modern, high-performance SDK supporting multiple languages with real-time capabilities.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-medium text-green-600 mb-1">Pros</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• 5-10x faster than Device SDK</li>
                        <li>• Real-time event streaming</li>
                        <li>• Multi-language support</li>
                        <li>• Modern gRPC protocol</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-orange-600 mb-1">Best For</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• Real-time attendance systems</li>
                        <li>• High-volume environments</li>
                        <li>• Cloud-based solutions</li>
                        <li>• Scalable deployments</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline">REST API</Badge>
                    <h3 className="font-semibold">BioStar 2 Web API</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Traditional REST API with JSON payloads for web-based integrations.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-medium text-green-600 mb-1">Pros</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• Standard HTTP/JSON</li>
                        <li>• Easy web integration</li>
                        <li>• Well-documented</li>
                        <li>• Platform agnostic</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-orange-600 mb-1">Best For</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• Web applications</li>
                        <li>• Simple integrations</li>
                        <li>• Batch operations</li>
                        <li>• Report generation</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Key API Endpoints</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">User Management</h4>
                  <div className="text-sm space-y-1">
                    <div><code className="bg-gray-200 px-2 py-1 rounded">POST /api/users</code> - Create employee</div>
                    <div><code className="bg-gray-200 px-2 py-1 rounded">GET /api/users</code> - List employees</div>
                    <div><code className="bg-gray-200 px-2 py-1 rounded">PUT /api/users/{id}</code> - Update employee</div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Event Logs</h4>
                  <div className="text-sm space-y-1">
                    <div><code className="bg-gray-200 px-2 py-1 rounded">GET /api/events</code> - Retrieve attendance logs</div>
                    <div><code className="bg-gray-200 px-2 py-1 rounded">GET /api/events/realtime</code> - Real-time events</div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Time & Attendance</h4>
                  <div className="text-sm space-y-1">
                    <div><code className="bg-gray-200 px-2 py-1 rounded">GET /tna/schedules</code> - Work schedules</div>
                    <div><code className="bg-gray-200 px-2 py-1 rounded">POST /tna/timecodes</code> - Time codes</div>
                    <div><code className="bg-gray-200 px-2 py-1 rounded">GET /tna/reports</code> - Attendance reports</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Implementation Guide */}
        <TabsContent value="implementation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                Implementation Roadmap
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 text-blue-800 rounded-full p-2 text-sm font-bold">1</div>
                  <div>
                    <h3 className="font-semibold mb-2">Hardware Setup & Network Configuration</h3>
                    <ul className="text-sm text-gray-600 space-y-1 ml-4">
                      <li>• Install BioLite N2 device at entry/exit points</li>
                      <li>• Configure network settings (IP, subnet, gateway)</li>
                      <li>• Set up device communication (TCP/IP or RS-485)</li>
                      <li>• Test device connectivity and basic functions</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 text-blue-800 rounded-full p-2 text-sm font-bold">2</div>
                  <div>
                    <h3 className="font-semibold mb-2">Software Environment Setup</h3>
                    <ul className="text-sm text-gray-600 space-y-1 ml-4">
                      <li>• Install BioStar 2 platform or G-SDK Gateway</li>
                      <li>• Set up development environment (Python/Node.js)</li>
                      <li>• Install required SDK libraries and dependencies</li>
                      <li>• Configure SSL certificates for secure communication</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 text-blue-800 rounded-full p-2 text-sm font-bold">3</div>
                  <div>
                    <h3 className="font-semibold mb-2">Employee Enrollment & Data Setup</h3>
                    <ul className="text-sm text-gray-600 space-y-1 ml-4">
                      <li>• Create employee database with unique IDs</li>
                      <li>• Enroll fingerprints and assign RFID cards</li>
                      <li>• Configure access groups and permissions</li>
                      <li>• Set up work schedules and time codes</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 text-blue-800 rounded-full p-2 text-sm font-bold">4</div>
                  <div>
                    <h3 className="font-semibold mb-2">Application Development</h3>
                    <ul className="text-sm text-gray-600 space-y-1 ml-4">
                      <li>• Develop real-time event monitoring system</li>
                      <li>• Implement attendance logging and database storage</li>
                      <li>• Create dashboard for attendance visualization</li>
                      <li>• Build reporting and analytics features</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 text-blue-800 rounded-full p-2 text-sm font-bold">5</div>
                  <div>
                    <h3 className="font-semibold mb-2">Testing & Deployment</h3>
                    <ul className="text-sm text-gray-600 space-y-1 ml-4">
                      <li>• Test system with sample employee data</li>
                      <li>• Verify real-time event processing</li>
                      <li>• Validate data accuracy and system performance</li>
                      <li>• Deploy to production environment</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-blue-500" />
                Development Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Official G-SDK Documentation</h4>
                    <p className="text-sm text-gray-600">Complete API reference and tutorials</p>
                  </div>
                  <Button size="sm" variant="outline" asChild>
                    <a href="https://supremainc.github.io/g-sdk/" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Docs
                    </a>
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">BioStar 2 API Reference</h4>
                    <p className="text-sm text-gray-600">REST API endpoints and examples</p>
                  </div>
                  <Button size="sm" variant="outline" asChild>
                    <a href="https://bs2api.biostar2.com/" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      API Docs
                    </a>
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">GitHub SDK Repository</h4>
                    <p className="text-sm text-gray-600">Source code and examples</p>
                  </div>
                  <Button size="sm" variant="outline" asChild>
                    <a href="https://github.com/supremainc/g-sdk" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      GitHub
                    </a>
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Suprema Support Portal</h4>
                    <p className="text-sm text-gray-600">Technical support and knowledge base</p>
                  </div>
                  <Button size="sm" variant="outline" asChild>
                    <a href="https://support.supremainc.com/" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Support
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Summary & Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Research Summary & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">Key Findings</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• BioLite N2 provides comprehensive biometric access control with IP67 outdoor rating</li>
              <li>• Suprema G-SDK offers modern gRPC-based integration with Python and Node.js support</li>
              <li>• Real-time event monitoring enables immediate attendance tracking</li>
              <li>• Multiple authentication methods (fingerprint, RFID, mobile) provide flexibility</li>
              <li>• Scalable architecture supports up to 10,000 users per device</li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Recommended Architecture</h4>
            <p className="text-sm text-blue-700 mb-2">
              For optimal employee time tracking implementation:
            </p>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Use G-SDK for real-time event processing and device management</li>
              <li>• Implement Node.js backend for API services and web dashboard</li>
              <li>• Use Python for data analytics and reporting systems</li>
              <li>• Deploy on cloud infrastructure for scalability and remote access</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}