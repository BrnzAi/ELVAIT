import Link from 'next/link';
import { Check, X, ArrowLeft } from 'lucide-react';

const plans = [
  {
    name: 'Try Out',
    price: '€199',
    priceDetail: 'for 3 months',
    description: 'Full assessment trial',
    tier: 'Full Standard',
    features: [
      { name: 'Assessments', value: '1', included: true },
      { name: 'Assessment type', value: 'Full Standard', included: true },
      { name: 'Respondents', value: '50', included: true },
      { name: 'Basic GO/FIX/NO-GO verdict', value: true, included: true },
      { name: 'Full role breakdown', value: true, included: true },
      { name: 'All flags & insights', value: true, included: true },
      { name: 'Contradiction detection', value: true, included: true },
      { name: 'Executive summary', value: true, included: true },
      { name: 'PDF Reports', value: true, included: true },
      { name: 'Custom roles', value: false, included: false },
      { name: 'Custom questions', value: false, included: false },
      { name: 'API access', value: false, included: false },
    ],
    cta: 'Contact Us',
    ctaLink: '/contact?plan=tryout',
    highlight: true,
    note: '€199 credited toward Core upgrade',
  },
  {
    name: 'Core',
    price: '€1,900',
    priceDetail: 'per year',
    description: 'For teams running multiple assessments',
    tier: 'Core',
    features: [
      { name: 'Assessments', value: 'Up to 10', included: true },
      { name: 'Assessment type', value: 'Core', included: true },
      { name: 'Respondents', value: '150 per assessment', included: true },
      { name: 'Basic GO/FIX/NO-GO verdict', value: true, included: true },
      { name: 'Full role breakdown', value: true, included: true },
      { name: 'All flags & insights', value: true, included: true },
      { name: 'Contradiction detection', value: true, included: true },
      { name: 'Executive summary', value: true, included: true },
      { name: 'PDF Reports', value: true, included: true },
      { name: 'Custom roles', value: false, included: false },
      { name: 'Custom questions', value: false, included: false },
      { name: 'API access', value: false, included: false },
    ],
    cta: 'Contact Us',
    ctaLink: '/contact?plan=core',
    highlight: false,
  },
  {
    name: 'Advanced',
    price: '€3,500',
    priceDetail: 'per year',
    description: 'Flexible questions & AI insights',
    tier: 'Advanced',
    features: [
      { name: 'Assessments', value: 'Up to 20', included: true },
      { name: 'Assessment type', value: 'Advanced', included: true },
      { name: 'Respondents', value: '250 per assessment', included: true },
      { name: 'Basic GO/FIX/NO-GO verdict', value: true, included: true },
      { name: 'Full role breakdown', value: true, included: true },
      { name: 'All flags & insights', value: true, included: true },
      { name: 'Contradiction detection', value: true, included: true },
      { name: 'Executive summary', value: true, included: true },
      { name: 'PDF Reports', value: true, included: true },
      { name: 'Custom roles', value: 'Limited', included: true },
      { name: 'Custom questions', value: 'Limited', included: true },
      { name: 'API access', value: false, included: false },
    ],
    cta: 'Contact Us',
    ctaLink: '/contact?plan=advanced',
    highlight: false,
    note: 'Includes AI clarity narrative & blind spot analysis',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    priceDetail: 'upon request',
    description: 'Full customization & API',
    tier: 'Enterprise',
    features: [
      { name: 'Assessments', value: 'Unlimited', included: true },
      { name: 'Assessment type', value: 'Full Custom', included: true },
      { name: 'Respondents', value: 'Unlimited', included: true },
      { name: 'Basic GO/FIX/NO-GO verdict', value: true, included: true },
      { name: 'Full role breakdown', value: true, included: true },
      { name: 'All flags & insights', value: true, included: true },
      { name: 'Contradiction detection', value: true, included: true },
      { name: 'Executive summary', value: true, included: true },
      { name: 'PDF Reports', value: true, included: true },
      { name: 'Custom roles', value: 'Full', included: true },
      { name: 'Custom questions', value: 'Full', included: true },
      { name: 'API access', value: true, included: true },
    ],
    cta: 'Contact Us',
    ctaLink: '/contact?plan=enterprise',
    highlight: false,
    note: 'Org-wide dashboard, scoring logic modification, dedicated onboarding',
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-elvait-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to ELVAIT</span>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Full assessments start at €199. Choose the plan that fits your needs.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-5 ${
                plan.highlight
                  ? 'bg-elvait-red ring-2 ring-elvait-green'
                  : 'bg-gray-900 border border-gray-800'
              }`}
            >
              {/* Plan Header */}
              <div className="mb-4">
                <h2 className="text-lg font-semibold mb-1">{plan.name}</h2>
                <p className={`text-xs ${plan.highlight ? 'text-elvait-green' : 'text-gray-400'}`}>
                  {plan.description}
                </p>
              </div>

              {/* Price */}
              <div className="mb-4">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className={`text-xs ml-1 ${plan.highlight ? 'text-elvait-green' : 'text-gray-400'}`}>
                  {plan.priceDetail}
                </span>
              </div>

              {/* CTA */}
              <Link
                href={plan.ctaLink}
                className={`block w-full py-2.5 px-4 rounded-lg text-center font-medium transition-colors mb-4 text-sm ${
                  plan.highlight
                    ? 'bg-white text-elvait-green hover:bg-gray-100'
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                }`}
              >
                {plan.cta}
              </Link>

              {/* Note */}
              {plan.note && (
                <p className={`text-xs mb-4 ${plan.highlight ? 'text-elvait-green' : 'text-gray-500'}`}>
                  {plan.note}
                </p>
              )}

              {/* Features */}
              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li
                    key={feature.name}
                    className={`flex items-start gap-2 text-xs ${
                      !feature.included && !plan.highlight ? 'text-gray-500' : ''
                    }`}
                  >
                    {feature.included ? (
                      <Check className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${
                        plan.highlight ? 'text-elvait-green' : 'text-green-400'
                      }`} />
                    ) : (
                      <X className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${
                        plan.highlight ? 'text-elvait-green' : 'text-gray-600'
                      }`} />
                    )}
                    <span>
                      {feature.name}
                      {typeof feature.value === 'string' && feature.included && (
                        <span className={`ml-1 ${plan.highlight ? 'text-elvait-green' : 'text-gray-400'}`}>
                          ({feature.value})
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold mb-8 text-center">Compare all features</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-4 px-4 font-medium text-gray-400">Feature</th>
                  {plans.map(plan => (
                    <th key={plan.name} className="text-center py-4 px-2 font-semibold">
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                <tr>
                  <td className="py-3 px-4 text-gray-400">Assessments</td>
                  <td className="py-3 px-2 text-center">1</td>
                  <td className="py-3 px-2 text-center">Up to 10</td>
                  <td className="py-3 px-2 text-center">Up to 20</td>
                  <td className="py-3 px-2 text-center">Unlimited</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-gray-400">Tier</td>
                  <td className="py-3 px-2 text-center">Full Standard</td>
                  <td className="py-3 px-2 text-center">Core</td>
                  <td className="py-3 px-2 text-center">Advanced</td>
                  <td className="py-3 px-2 text-center">Custom</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-gray-400">Respondents</td>
                  <td className="py-3 px-2 text-center">50</td>
                  <td className="py-3 px-2 text-center">150</td>
                  <td className="py-3 px-2 text-center">250</td>
                  <td className="py-3 px-2 text-center">Unlimited</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-gray-400">Full results & insights</td>
                  <td className="py-3 px-2 text-center"><Check className="w-4 h-4 mx-auto text-green-400" /></td>
                  <td className="py-3 px-2 text-center"><Check className="w-4 h-4 mx-auto text-green-400" /></td>
                  <td className="py-3 px-2 text-center"><Check className="w-4 h-4 mx-auto text-green-400" /></td>
                  <td className="py-3 px-2 text-center"><Check className="w-4 h-4 mx-auto text-green-400" /></td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-gray-400">PDF Reports</td>
                  <td className="py-3 px-2 text-center"><Check className="w-4 h-4 mx-auto text-green-400" /></td>
                  <td className="py-3 px-2 text-center"><Check className="w-4 h-4 mx-auto text-green-400" /></td>
                  <td className="py-3 px-2 text-center"><Check className="w-4 h-4 mx-auto text-green-400" /></td>
                  <td className="py-3 px-2 text-center"><Check className="w-4 h-4 mx-auto text-green-400" /></td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-gray-400">Custom roles</td>
                  <td className="py-3 px-2 text-center"><X className="w-4 h-4 mx-auto text-gray-600" /></td>
                  <td className="py-3 px-2 text-center"><X className="w-4 h-4 mx-auto text-gray-600" /></td>
                  <td className="py-3 px-2 text-center">Limited</td>
                  <td className="py-3 px-2 text-center">Full</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-gray-400">Custom questions</td>
                  <td className="py-3 px-2 text-center"><X className="w-4 h-4 mx-auto text-gray-600" /></td>
                  <td className="py-3 px-2 text-center"><X className="w-4 h-4 mx-auto text-gray-600" /></td>
                  <td className="py-3 px-2 text-center">Limited</td>
                  <td className="py-3 px-2 text-center">Full</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-gray-400">AI clarity narrative</td>
                  <td className="py-3 px-2 text-center"><X className="w-4 h-4 mx-auto text-gray-600" /></td>
                  <td className="py-3 px-2 text-center"><X className="w-4 h-4 mx-auto text-gray-600" /></td>
                  <td className="py-3 px-2 text-center"><Check className="w-4 h-4 mx-auto text-green-400" /></td>
                  <td className="py-3 px-2 text-center"><Check className="w-4 h-4 mx-auto text-green-400" /></td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-gray-400">API access</td>
                  <td className="py-3 px-2 text-center"><X className="w-4 h-4 mx-auto text-gray-600" /></td>
                  <td className="py-3 px-2 text-center"><X className="w-4 h-4 mx-auto text-gray-600" /></td>
                  <td className="py-3 px-2 text-center"><X className="w-4 h-4 mx-auto text-gray-600" /></td>
                  <td className="py-3 px-2 text-center"><Check className="w-4 h-4 mx-auto text-green-400" /></td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-gray-400">Price</td>
                  <td className="py-3 px-2 text-center font-semibold">€199/3mo</td>
                  <td className="py-3 px-2 text-center font-semibold">€1,900/yr</td>
                  <td className="py-3 px-2 text-center font-semibold">€3,500/yr</td>
                  <td className="py-3 px-2 text-center font-semibold">Custom</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ / Contact Section */}
        <div className="mt-20 text-center">
          <h2 className="text-2xl font-bold mb-4">Questions?</h2>
          <p className="text-gray-400 mb-6">
            We'd love to help you find the right plan for your needs.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            Contact us
          </Link>
        </div>
      </div>
    </div>
  );
}
