
import React, { useState } from 'react';
import { X, ShoppingBag, Package, Star, Award, Truck, Shield } from 'lucide-react';

interface TemplateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (templateContent: string) => void;
}

const TemplateDialog: React.FC<TemplateDialogProps> = ({ isOpen, onClose, onInsert }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  const templates = [
    {
      id: 'product-features',
      name: 'Product Features',
      icon: Package,
      content: `
        <h3>🌟 Key Features</h3>
        <ul>
          <li><strong>✅ Premium Quality:</strong> Made with high-quality materials for lasting durability</li>
          <li><strong>🚀 Fast Performance:</strong> Optimized for speed and efficiency in daily use</li>
          <li><strong>🎨 Elegant Design:</strong> Sleek and modern aesthetic that fits any environment</li>
          <li><strong>🔧 Easy Setup:</strong> Quick and hassle-free installation process</li>
        </ul>
      `
    },
    {
      id: 'specifications',
      name: 'Product Specifications',
      icon: Award,
      content: `
        <h3>📋 Specifications</h3>
        <table>
          <tr>
            <td><strong>Dimensions</strong></td>
            <td>15" x 12" x 8"</td>
          </tr>
          <tr>
            <td><strong>Weight</strong></td>
            <td>2.5 lbs</td>
          </tr>
          <tr>
            <td><strong>Material</strong></td>
            <td>Premium aluminum alloy</td>
          </tr>
          <tr>
            <td><strong>Color Options</strong></td>
            <td>Black, Silver, Rose Gold</td>
          </tr>
          <tr>
            <td><strong>Warranty</strong></td>
            <td>2 years limited warranty</td>
          </tr>
        </table>
      `
    },
    {
      id: 'shipping-returns',
      name: 'Shipping & Returns',
      icon: Truck,
      content: `
        <h3>🚚 Shipping & Returns</h3>
        <h4>📦 Shipping Information</h4>
        <ul>
          <li>Free shipping on orders over $50</li>
          <li>Standard delivery: 3-5 business days</li>
          <li>Express shipping available (1-2 days)</li>
          <li>International shipping to most countries</li>
        </ul>
        <h4>🔄 Return Policy</h4>
        <ul>
          <li>30-day return window</li>
          <li>Free returns on defective items</li>
          <li>Items must be in original condition</li>
          <li>Refund processed within 5-7 business days</li>
        </ul>
      `
    },
    {
      id: 'customer-reviews',
      name: 'Customer Reviews',
      icon: Star,
      content: `
        <h3>⭐ Customer Reviews</h3>
        <p><strong>⭐⭐⭐⭐⭐ Sarah M.</strong><br>
        <em>"Absolutely love this product! The quality is outstanding and it arrived faster than expected. Highly recommend!"</em></p>
        
        <p><strong>⭐⭐⭐⭐⭐ John D.</strong><br>
        <em>"Great value for money. The design is sleek and it works perfectly. Customer service was also very helpful."</em></p>
        
        <p><strong>⭐⭐⭐⭐⭐ Emily R.</strong><br>
        <em>"Exceeded my expectations! The quality is amazing and it's exactly what I was looking for. Will definitely buy again."</em></p>
      `
    },
    {
      id: 'warranty-support',
      name: 'Warranty & Support',
      icon: Shield,
      content: `
        <h3>🛡️ Warranty & Support</h3>
        <h4>🔒 Warranty Coverage</h4>
        <ul>
          <li><strong>2-Year Limited Warranty</strong> on manufacturing defects</li>
          <li>Coverage includes parts and labor</li>
          <li>Warranty valid from purchase date</li>
          <li>Register your product for extended benefits</li>
        </ul>
        <h4>📞 Customer Support</h4>
        <ul>
          <li>24/7 customer support hotline</li>
          <li>Live chat available on our website</li>
          <li>Comprehensive FAQ and troubleshooting guides</li>
          <li>Video tutorials and setup guides</li>
        </ul>
        <p><strong>Need Help? Contact Us:</strong><br>
        📧 support@company.com | 📞 1-800-SUPPORT</p>
      `
    },
    {
      id: 'product-comparison',
      name: 'Product Comparison',
      icon: ShoppingBag,
      content: `
        <h3>⚖️ Product Comparison</h3>
        <table>
          <thead>
            <tr>
              <th>Feature</th>
              <th>Basic</th>
              <th>Pro ⭐</th>
              <th>Premium</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Price</strong></td>
              <td>$99</td>
              <td>$149</td>
              <td>$199</td>
            </tr>
            <tr>
              <td><strong>Warranty</strong></td>
              <td>1 Year</td>
              <td>2 Years</td>
              <td>3 Years</td>
            </tr>
            <tr>
              <td><strong>Features</strong></td>
              <td>Standard</td>
              <td>Advanced</td>
              <td>Premium</td>
            </tr>
            <tr>
              <td><strong>Support</strong></td>
              <td>Email</td>
              <td>24/7 Chat</td>
              <td>Priority</td>
            </tr>
          </tbody>
        </table>
      `
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTemplate) return;
    
    const template = templates.find(t => t.id === selectedTemplate);
    if (template) {
      onInsert(template.content);
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedTemplate('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-800">E-commerce Templates</h3>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {templates.map((template) => {
              const IconComponent = template.icon;
              return (
                <div
                  key={template.id}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                    selectedTemplate === template.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <div className="flex items-center gap-3">
                    <IconComponent 
                      size={24} 
                      className={selectedTemplate === template.id ? 'text-blue-600' : 'text-gray-600'} 
                    />
                    <div>
                      <h4 className={`font-medium ${
                        selectedTemplate === template.id ? 'text-blue-900' : 'text-gray-900'
                      }`}>
                        {template.name}
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">
                        Professional template for e-commerce product descriptions
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedTemplate}
              className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-md transition-colors"
            >
              Insert Template
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TemplateDialog;
