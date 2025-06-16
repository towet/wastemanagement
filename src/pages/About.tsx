import React from 'react';
import { 
  Recycle, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Users, 
  Target, 
  Heart,
  Award,
  Leaf,
  TreePine,
  Shield
} from 'lucide-react';

export const About: React.FC = () => {
  const teamMembers = [
    {
      name: "Sarah Chen",
      role: "CEO & Co-founder",
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
      bio: "Environmental engineer with 10+ years in sustainable technology"
    },
    {
      name: "Marcus Johnson",
      role: "CTO & Co-founder",
      image: "https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=400",
      bio: "IoT specialist focused on smart city solutions and waste management"
    },
    {
      name: "Elena Rodriguez",
      role: "Head of Operations",
      image: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=400",
      bio: "Operations expert with extensive experience in logistics and optimization"
    }
  ];

  const achievements = [
    { icon: Users, value: "50K+", label: "Active Users" },
    { icon: Recycle, value: "1M+", label: "Tons Recycled" },
    { icon: TreePine, value: "2.5M", label: "Trees Saved" },
    { icon: Award, value: "15", label: "Awards Won" }
  ];

  const features = [
    {
      icon: Recycle,
      title: "Smart Waste Tracking",
      description: "Advanced IoT sensors monitor waste levels in real-time, optimizing collection routes and reducing operational costs."
    },
    {
      icon: Leaf,
      title: "Environmental Impact",
      description: "Track your carbon footprint reduction and see the positive environmental impact of your waste management practices."
    },
    {
      icon: Shield,
      title: "Data Security",
      description: "Enterprise-grade security ensures your data is protected with end-to-end encryption and compliance standards."
    }
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 md:p-12 text-white">
        <div className="max-w-4xl">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Recycle className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">EcoTrack</h1>
          </div>
          <p className="text-xl md:text-2xl mb-6 text-emerald-100 leading-relaxed">
            Revolutionizing waste management through intelligent IoT solutions and data-driven insights for a sustainable future.
          </p>
          <div className="flex items-center space-x-6 text-emerald-100">
            <div className="flex items-center">
              <Heart className="w-5 h-5 mr-2" />
              <span>Built with Purpose</span>
            </div>
            <div className="flex items-center">
              <Globe className="w-5 h-5 mr-2" />
              <span>Global Impact</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
            <Target className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Mission</h2>
          <p className="text-slate-600 leading-relaxed">
            To transform waste management practices worldwide by providing intelligent, data-driven solutions that make recycling and waste reduction accessible, efficient, and impactful for communities and businesses alike.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
            <Globe className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Vision</h2>
          <p className="text-slate-600 leading-relaxed">
            A world where waste is minimized, resources are maximized, and every individual and organization contributes to a circular economy that benefits both people and the planet.
          </p>
        </div>
      </div>

      {/* Key Features */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">What Makes Us Different</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-white">
        <h2 className="text-2xl font-bold text-center mb-8">Our Impact</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {achievements.map((achievement, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <achievement.icon className="w-8 h-8" />
              </div>
              <div className="text-3xl font-bold mb-2">{achievement.value}</div>
              <div className="text-slate-300 text-sm">{achievement.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Meet Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="text-center group">
              <div className="relative mb-4">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-emerald-100 group-hover:border-emerald-200 transition-colors"
                />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-1">{member.name}</h3>
              <p className="text-emerald-600 font-medium mb-3">{member.role}</p>
              <p className="text-slate-600 text-sm leading-relaxed">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Get In Touch</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Email</h3>
            <p className="text-slate-600 text-sm">hello@ecotrack.com</p>
            <p className="text-slate-600 text-sm">support@ecotrack.com</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Phone className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Phone</h3>
            <p className="text-slate-600 text-sm">+1 (555) 123-4567</p>
            <p className="text-slate-600 text-sm">+1 (555) 987-6543</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Address</h3>
            <p className="text-slate-600 text-sm">123 Green Street</p>
            <p className="text-slate-600 text-sm">Eco City, EC 12345</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Globe className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Website</h3>
            <p className="text-slate-600 text-sm">www.ecotrack.com</p>
            <p className="text-slate-600 text-sm">blog.ecotrack.com</p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-200 text-center">
          <p className="text-slate-600 mb-4">
            Have questions or want to learn more about our solutions?
          </p>
          <button className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors font-medium">
            Contact Our Team
          </button>
        </div>
      </div>
    </div>
  );
};