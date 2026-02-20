import Link from 'next/link';
import { Check, X, ArrowLeft } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: '€0',
    priceDetail: 'forever',
    description: 'Try your first assessment',
    features: [
      { name: 'Active assessments', value: '1', included: true },
      { name: 'Respondents per assessment', value: '10', included: true },
      { name: 'Role breakdown', value: true, included: true },
      { name: 'All flags & insights', value: true, included: true },
      { name: 'Contradiction map', value: true, included: true },
      { name: 'PDF Reports', value: false, included: false },
      { name: 'Custom roles', value: false, included: false },
      { name: 'Custom questions', value: false, included: false },
      { name: 'Cross-case analytics', value: false, included: false },
      { name: 'API access', value: false, included: false },
    ],
    cta: 'Get Started',
    ctaLink: '/signup',
    highlight: false,
  },
  {
    name: 'Starter',
    price: '€79',
    priceDetail: 'per decision',
    description: 'For important decisions',
    features: [
      { name: 'Active assessments', value: '3', included: true },
      { name: 'Respondents per assessment', value: '25', included: true },
      { name: 'Role breakdown', value: true, included: true },
      { name: 'All flags & insights', value: true, included: true },
      { name: 'Contradiction map', value: true, included: true },
      { name: 'PDF Reports', value: true, included: true },
      { name: 'Custom roles', value: false, included: false },
      { name: 'Custom questions', value: false, included: false },
      { name: 'Cross-case analytics', value: false, included: false },
      { name: 'API access', value: false, included: false },
    ],
    cta: 'Contact Us',
    ctaLink: '/contact?plan=starter',
    highlight: true,
  },
  {
    name: 'Professional',
    price: '€149–299',
    priceDetail: 'per month',
    description: 'For teams & consultants',
    features: [
      { name: 'Active assessments', value: 'Unlimited', included: true },
      { name: 'Respondents per assessment', value: '100', included: true },
      { name: 'Role breakdown', value: true, included: true },
      { name: 'All flags & insights', value: true, included: true },
      { name: 'Contradiction map', value: true, included: true },
      { name: 'PDF Reports', value: true, included: true },
      { name: 'Custom roles', value: '+2 roles', included: true },
      { name: 'Custom questions', value: 'Limited', included: true },
      { name: 'Cross-case analytics', value: true, included: true },
      { name: 'API access', value: false, included: false },
    ],
    cta: 'Contact Us',
    ctaLink: '/contact?plan=professional',
    highlight: false,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    priceDetail: 'annual contract',
    description: 'For organizations',
    features: [
      { name: 'Active assessments', value: 'Unlimited', included: true },
      { name: 'Respondents per assessment', value: 'Unlimited', included: true },
      { name: 'Role breakdown', value: true, included: true },
      { name: 'All flags & insights', value: true, included: true },
      { name: 'Contradiction map', value: true, included: true },
      { name: 'PDF Reports', value: true, included: true },
      { name: 'Custom roles', value: 'Unlimited', included: true },
      { name: 'Custom questions', value: 'Full', included: true },
      { name: 'Cross-case analytics', value: true, included: true },
      { name: 'API access', value: true, included: true },
    ],
    cta: 'Contact Us',
    ctaLink: '/contact?plan=enterprise',
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
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
            Start free. Upgrade when you need more assessments or advanced features.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-6 ${
                plan.highlight
                  ? 'bg-blue-600 ring-2 ring-blue-400'
                  : 'bg-gray-900 border border-gray-800'
              }`}
            >
              {/* Plan Header */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-1">{plan.name}</h2>
                <p className={`text-sm ${plan.highlight ? 'text-blue-200' : 'text-gray-400'}`}>
                  {plan.description}
                </p>
              </div>

              {/* Price */}
              <div className="mb-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className={`text-sm ml-2 ${plan.highlight ? 'text-blue-200' : 'text-gray-400'}`}>
                  {plan.priceDetail}
                </span>
              </div>

              {/* CTA */}
              <Link
                href={plan.ctaLink}
                className={`block w-full py-3 px-4 rounded-lg text-center font-medium transition-colors mb-6 ${
                  plan.highlight
                    ? 'bg-white text-blue-600 hover:bg-gray-100'
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                }`}
              >
                {plan.cta}
              </Link>

              {/* Features */}
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature.name}
                    className={`flex items-start gap-2 text-sm ${
                      !feature.included && !plan.highlight ? 'text-gray-500' : ''
                    }`}
                  >
                    {feature.included ? (
                      <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                        plan.highlight ? 'text-blue-200' : 'text-green-400'
                      }`} />
                    ) : (
                      <X className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                        plan.highlight ? 'text-blue-300' : 'text-gray-600'
                      }`} />
                    )}
                    <span>
                      {feature.name}
                      {typeof feature.value === 'string' && feature.included && (
                        <span className={`ml-1 ${plan.highlight ? 'text-blue-200' : 'text-gray-400'}`}>
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
