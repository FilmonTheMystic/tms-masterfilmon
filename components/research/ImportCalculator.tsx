'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Calculator, 
  DollarSign, 
  Package, 
  Truck, 
  FileText, 
  AlertTriangle,
  Info,
  TrendingUp,
  Globe
} from 'lucide-react';
import { importCalculator } from '@/lib/data/suppliers';

interface ImportCalculation {
  originalPrice: number;
  importDuty: number;
  vat: number;
  shippingCost: number;
  clearingFees: number;
  totalCost: number;
}

export function ImportCalculator() {
  const [price, setPrice] = useState<number>(1000);
  const [currency, setCurrency] = useState<'USD' | 'CNY'>('USD');
  const [weight, setWeight] = useState<number>(2);
  const [quantity, setQuantity] = useState<number>(1);
  const [calculation, setCalculation] = useState<ImportCalculation | null>(null);

  const exchangeRates = {
    USD: 18.5,
    CNY: 2.6
  };

  const handleCalculate = () => {
    const totalPrice = price * quantity;
    const totalWeight = weight * quantity;
    const result = importCalculator.calculateImportCost(totalPrice, currency, totalWeight);
    setCalculation(result);
  };

  const formatCurrency = (amount: number) => {
    return `R${amount.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getCurrencySymbol = (curr: string) => {
    return curr === 'USD' ? '$' : '¥';
  };

  const savingsVsLocal = calculation ? (calculation.totalCost * 0.3) : 0; // Assuming 30% potential savings

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Calculator className="h-6 w-6" />
            Import Cost Calculator
          </h2>
          <p className="text-muted-foreground">
            Calculate total costs for importing PC components from China to South Africa
          </p>
        </div>
        <Badge variant="outline" className="flex items-center gap-1">
          <Globe className="h-3 w-3" />
          China → South Africa
        </Badge>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Product Details
            </CardTitle>
            <CardDescription>
              Enter the details of the components you want to import
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Unit Price</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                    {getCurrencySymbol(currency)}
                  </span>
                  <Input
                    id="price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="pl-8"
                    placeholder="1000"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="currency">Currency</Label>
                <Select value={currency} onValueChange={(value: 'USD' | 'CNY') => setCurrency(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="CNY">CNY (¥)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="weight">Weight per unit (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  placeholder="2.0"
                />
              </div>
              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  placeholder="1"
                />
              </div>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Exchange Rate:</strong> 1 {currency} = R{exchangeRates[currency]} (approximate)
              </AlertDescription>
            </Alert>

            <Button onClick={handleCalculate} className="w-full">
              <Calculator className="h-4 w-4 mr-2" />
              Calculate Import Costs
            </Button>
          </CardContent>
        </Card>

        {/* Calculation Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Cost Breakdown
            </CardTitle>
            <CardDescription>
              Detailed breakdown of all import-related costs
            </CardDescription>
          </CardHeader>
          <CardContent>
            {calculation ? (
              <div className="space-y-4">
                <div className="grid gap-3">
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                    <span className="font-medium">Product Cost ({currency})</span>
                    <span className="font-bold">
                      {getCurrencySymbol(currency)}{(price * quantity).toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span>Product Cost (ZAR)</span>
                    <span className="font-semibold">{formatCurrency(calculation.originalPrice)}</span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-red-50 rounded">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-red-600" />
                      <span>Import Duty (15%)</span>
                    </div>
                    <span className="font-semibold text-red-600">{formatCurrency(calculation.importDuty)}</span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-orange-50 rounded">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-orange-600" />
                      <span>VAT (15%)</span>
                    </div>
                    <span className="font-semibold text-orange-600">{formatCurrency(calculation.vat)}</span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded">
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-purple-600" />
                      <span>Shipping ({(weight * quantity).toFixed(1)}kg)</span>
                    </div>
                    <span className="font-semibold text-purple-600">{formatCurrency(calculation.shippingCost)}</span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-yellow-50 rounded">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-yellow-600" />
                      <span>Clearing Fees</span>
                    </div>
                    <span className="font-semibold text-yellow-600">{formatCurrency(calculation.clearingFees)}</span>
                  </div>

                  <hr className="my-2" />

                  <div className="flex justify-between items-center p-4 bg-green-50 rounded border-2 border-green-200">
                    <span className="text-lg font-bold text-green-800">Total Landed Cost</span>
                    <span className="text-xl font-bold text-green-600">{formatCurrency(calculation.totalCost)}</span>
                  </div>

                  <div className="text-center p-3 bg-gray-100 rounded">
                    <div className="text-sm text-muted-foreground">Cost per unit</div>
                    <div className="text-lg font-bold">{formatCurrency(calculation.totalCost / quantity)}</div>
                  </div>
                </div>

                {/* Additional Insights */}
                <div className="space-y-3 pt-4 border-t">
                  <h4 className="font-semibold flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Cost Analysis
                  </h4>
                  
                  <div className="grid gap-2 text-sm">
                    <div className="flex justify-between">
                      <span>Total markup from base price:</span>
                      <span className="font-semibold">
                        {(((calculation.totalCost - calculation.originalPrice) / calculation.originalPrice) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duties & taxes:</span>
                      <span className="font-semibold">
                        {formatCurrency(calculation.importDuty + calculation.vat)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Logistics costs:</span>
                      <span className="font-semibold">
                        {formatCurrency(calculation.shippingCost + calculation.clearingFees)}
                      </span>
                    </div>
                  </div>

                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Potential Savings vs Local:</strong> Even with import costs, you could save up to {formatCurrency(savingsVsLocal)} compared to local pricing (estimated).
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Calculate</h3>
                <p className="text-gray-600">
                  Enter your product details and click calculate to see the total import costs
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Information Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Import Duties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Computer Components:</span>
                <span className="font-semibold">15%</span>
              </div>
              <div className="flex justify-between">
                <span>Monitors:</span>
                <span className="font-semibold">15%</span>
              </div>
              <div className="flex justify-between">
                <span>Accessories:</span>
                <span className="font-semibold">20%</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Rates may vary based on HS codes and trade agreements
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Shipping Options</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Air Freight:</span>
                <span className="font-semibold">R120-200/kg</span>
              </div>
              <div className="flex justify-between">
                <span>Sea Freight:</span>
                <span className="font-semibold">R50-80/kg</span>
              </div>
              <div className="flex justify-between">
                <span>Express Courier:</span>
                <span className="font-semibold">R250-400/kg</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Delivery times: Air (5-10 days), Sea (15-30 days), Express (3-7 days)
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Additional Costs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Clearing Agent:</span>
                <span className="font-semibold">R500-1500</span>
              </div>
              <div className="flex justify-between">
                <span>Documentation:</span>
                <span className="font-semibold">R200-500</span>
              </div>
              <div className="flex justify-between">
                <span>Port Charges:</span>
                <span className="font-semibold">R300-800</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Costs may vary by port and clearing agent
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tips and Warnings */}
      <Card>
        <CardHeader>
          <CardTitle>Import Tips & Considerations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2 text-green-600">✓ Money-Saving Tips</h4>
              <ul className="space-y-1 text-sm">
                <li>• Consolidate shipments to reduce per-kg costs</li>
                <li>• Consider sea freight for non-urgent orders</li>
                <li>• Work with experienced clearing agents</li>
                <li>• Verify HS codes for accurate duty rates</li>
                <li>• Factor in currency fluctuation risks</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-red-600">⚠ Important Warnings</h4>
              <ul className="space-y-1 text-sm">
                <li>• Beware of counterfeit products on marketplaces</li>
                <li>• Check warranty validity in South Africa</li>
                <li>• Verify supplier credentials before payment</li>
                <li>• Consider insurance for high-value shipments</li>
                <li>• Factor in return/replacement difficulties</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}