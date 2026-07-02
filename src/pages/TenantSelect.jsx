import { useState, useEffect } from 'react';
import { api } from '@/api/backendClient';
import { Zap, Check, ArrowRight } from 'lucide-react';

const plans = [
  {
    id: 'basic',
    name: 'Basic',
    price: 'Free',
    max_pcs: 10,
    max_users: 100,
    features: ['10 PCs', '100 Users', 'Standard Support', 'Basic Analytics']
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$99/mo',
    max_pcs: 50,
    max_users: 500,
    features: ['50 PCs', '500 Users', 'Priority Support', 'Advanced Analytics', 'Custom Branding'],
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '$299/mo',
    max_pcs: 200,
    max_users: 2000,
    features: ['200 PCs', '2000 Users', '24/7 Support', 'Full Analytics', 'Custom Branding', 'API Access']
  }
];

export default function TenantSelect() {
  const [step, setStep] = useState('select'); // select, register, success
  const [selectedPlan, setSelectedPlan] = useState('basic');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    slug: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.registerTenant({
        ...formData,
        plan: selectedPlan
      });

      // Set the new tenant
      api.setTenant(formData.slug);
      
      setStep('success');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleUseDefault = () => {
    api.setTenant('default');
    window.location.href = '/';
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-background grid-bg flex items-center justify-center p-4">
        <div className="glass-card rounded-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6 neon-glow-pink">
            <Check className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">
            Tenant Created!
          </h1>
          <p className="text-muted-foreground mb-6">
            Your gaming center "{formData.name}" has been successfully registered.
          </p>
          <button
            onClick={() => (window.location.href = '/')}
            className="w-full h-12 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background grid-bg flex items-center justify-center p-4">
      <div className="glass-card rounded-2xl p-8 max-w-4xl w-full">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center mx-auto mb-4 neon-glow-pink">
            <Zap className="w-6 h-6 text-primary" strokeWidth={2.5} />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2 neon-text-cyan">
            NEXUS ARENA
          </h1>
          <p className="text-muted-foreground">
            Gaming Center Management System
          </p>
        </div>

        {step === 'select' && (
          <div>
            <div className="mb-6 text-center">
              <h2 className="font-display text-xl font-semibold text-foreground mb-2">
                Choose Your Plan
              </h2>
              <p className="text-sm text-muted-foreground">
                Start with our default tenant or create your own
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`relative rounded-xl p-6 cursor-pointer transition-all border-2 ${
                    selectedPlan === plan.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border bg-card/60 hover:border-primary/50'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                      Popular
                    </div>
                  )}
                  <h3 className="font-display text-lg font-bold text-foreground mb-1">
                    {plan.name}
                  </h3>
                  <p className="text-2xl font-bold text-primary mb-4">{plan.price}</p>
                  <ul className="space-y-2 text-sm">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-muted-foreground">
                        <Check className="w-4 h-4 text-primary flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleUseDefault}
                className="flex-1 h-12 rounded-lg border border-border bg-card/60 text-foreground font-semibold hover:bg-muted/40 transition-colors"
              >
                Use Default Tenant
              </button>
              <button
                onClick={() => setStep('register')}
                className="flex-1 h-12 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                Create New Tenant
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <button
                type="button"
                onClick={() => setStep('select')}
                className="text-sm text-muted-foreground hover:text-foreground mb-4"
              >
                ← Back to plans
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Gaming Center Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full h-10 rounded-md border border-border bg-muted/50 px-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="My Gaming Center"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full h-10 rounded-md border border-border bg-muted/50 px-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="contact@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Slug (URL) *
                </label>
                <input
                  type="text"
                  required
                  pattern="[a-z0-9-]+"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                  className="w-full h-10 rounded-md border border-border bg-muted/50 px-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="my-gaming-center"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Only lowercase letters, numbers, and hyphens
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full h-10 rounded-md border border-border bg-muted/50 px-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="+976 9999 9999"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full h-10 rounded-md border border-border bg-muted/50 px-3 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Ulaanbaatar, Mongolia"
              />
            </div>

            <div className="rounded-lg bg-muted/40 p-4">
              <p className="text-sm text-muted-foreground">
                <strong>Selected Plan:</strong> {plans.find((p) => p.id === selectedPlan)?.name}
                {' - '}
                {plans.find((p) => p.id === selectedPlan)?.price}
              </p>
            </div>

            {error && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Tenant'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
