import React from 'react';
import { FaCheckCircle, FaRocket, FaCrown, FaUserAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

const PricingPage = () => {
  const plans = [
    {
      name: "Free Observer",
      price: "$0",
      icon: <FaUserAlt />,
      features: ["All HD Content", "Public Watch History", "Standard 3D Visualizer", "Ads Supported"],
      btnText: "Current Path",
      popular: false
    },
    {
      name: "Stellar Pro",
      price: "$9.99/mo",
      icon: <FaRocket />,
      features: ["4K Ultra HD", "Private History", "Advanced 3D Shader Controls", "Offline Downloads", "No Advertisements"],
      btnText: "Ignite Engine",
      popular: true
    },
    {
      name: "Galactic Master",
      price: "$19.99/mo",
      icon: <FaCrown />,
      features: ["Early Access to Trailers", "Exclusive Admin Insights", "Custom VR Experience", "Unlimited Screens", "Priority Galactic Support"],
      btnText: "Ascend Now",
      popular: false
    }
  ];

  return (
    <div className="search-page" style={{ paddingTop: '120px' }}>
      <div className="search-header" style={{ textAlign: 'center' }}>
        <h1 className="heading-lg text-gradient">Elevate Your Reality</h1>
        <p className="text-muted">Choose your tier and explore the deeper sectors of the Movie Universe.</p>
      </div>

      <div className="pricing-container" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '40px', 
        padding: '60px var(--container-px)',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {plans.map((plan, index) => (
          <motion.div 
            key={plan.name}
            className={`glass-panel pricing-card ${plan.popular ? 'popular' : ''}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            style={{
              padding: '40px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              position: 'relative',
              border: plan.popular ? '2px solid var(--accent-blue)' : '1px solid var(--border-color)',
              boxShadow: plan.popular ? '0 0 30px rgba(0, 240, 255, 0.2)' : 'none'
            }}
          >
            {plan.popular && (
              <div style={{
                position: 'absolute',
                top: '-15px',
                background: 'var(--accent-blue)',
                color: '#000',
                padding: '5px 15px',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: '700',
                textTransform: 'uppercase'
              }}>
                Most Popular
              </div>
            )}
            
            <div style={{ 
              fontSize: '3rem', 
              color: plan.popular ? 'var(--accent-blue)' : 'var(--accent-primary)',
              marginBottom: '20px'
            }}>
              {plan.icon}
            </div>
            
            <h2 className="heading-md">{plan.name}</h2>
            <div style={{ fontSize: '2.5rem', fontWeight: '700', margin: '20px 0' }}>{plan.price}</div>
            
            <ul style={{ 
              textAlign: 'left', 
              width: '100%', 
              marginBottom: '40px',
              display: 'flex',
              flexDirection: 'column',
              gap: '15px'
            }}>
              {plan.features.map(feature => (
                <li key={feature} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)' }}>
                  <FaCheckCircle style={{ color: 'var(--accent-blue)', flexShrink: 0 }} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button 
              className={plan.popular ? 'btn-primary' : 'btn-secondary'} 
              style={{ width: '100%', marginTop: 'auto' }}
            >
              {plan.btnText}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PricingPage;
