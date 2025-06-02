"use client";
import React, { useState } from "react";
import { Dialog } from "./ui/dialog";
import { Button } from "./ui/button";
import { DialogTrigger } from "@radix-ui/react-dialog";
import AuthDialogContent from "./AuthDialogContent";
import { useRouter } from "next/navigation";
import { useAdminStore } from "@/stores/adminStore";
import { IMAGE_LINKS } from "@/assets/imageLinks";
import { useCustomerCareStore } from "@/stores/customerCareStore";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Heart,
  Leaf,
  ShieldCheck,
  Timer,
  Users,
} from "lucide-react";

const AboutUsPage = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const adminZ = useAdminStore((state) => state.user);
  const customerCareZ = useCustomerCareStore((state) => state.user);
  const logout = useAdminStore((state) => state.logout);

  const features = [
    {
      icon: <Timer className="w-6 h-6" />,
      title: "Quick Delivery",
      description: "Get your food delivered within minutes of ordering",
    },
    {
      icon: <Leaf className="w-6 h-6" />,
      title: "Eco-Friendly",
      description: "Reducing food waste and environmental impact",
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Community Focus",
      description: "Supporting local businesses and communities",
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: "Safe & Secure",
      description: "Ensuring food safety and secure transactions",
    },
  ];

  const stats = [
    { number: "50K+", label: "Meals Saved" },
    { number: "100+", label: "Partner Restaurants" },
    { number: "10K+", label: "Happy Customers" },
    { number: "5", label: "Cities Served" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-primary">FlashFood</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Revolutionizing food delivery while fighting waste and hunger in our
            communities
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Get Started <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="lg" variant="outline">
                  Sign In
                </Button>
              </DialogTrigger>
              <AuthDialogContent onClose={() => setOpen(false)} />
            </Dialog>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose FlashFood?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're more than just a food delivery service. We're a movement
              towards sustainable, accessible, and community-focused food
              distribution.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="text-primary mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gradient-to-r from-primary/5 to-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-gray-600 mb-4">
                Founded in late 2024, FlashFood has quickly grown into a
                movement dedicated to reducing food waste while making quality
                meals accessible to everyone.
              </p>
              <p className="text-gray-600 mb-6">
                We've partnered with hundreds of local restaurants and grocery
                stores to rescue surplus food, creating a win-win situation for
                businesses, consumers, and the environment.
              </p>
              <Button variant="outline" size="lg">
                Join Our Mission <Users className="ml-2 w-4 h-4" />
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="aspect-square rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                  alt="Food delivery"
                  className="object-cover w-full h-full"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;
