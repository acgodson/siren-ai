import React, { useEffect, useRef } from "react";
import { Box, Flex, Text, Button, Image, Container } from "@chakra-ui/react";
import { Database, Users, LineChart, Coins } from "lucide-react";

const WelcomeContent = () => {
  // Intersection Observer setup
  const setupIntersectionObserver = () => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
          observer.unobserve(entry.target); // Stop observing once animated
        }
      });
    }, options);

    // Observe all elements with animate-on-scroll class
    document.querySelectorAll(".animate-on-scroll").forEach((element) => {
      observer.observe(element);
    });
  };

  useEffect(() => {
    setupIntersectionObserver();
  }, []);

  return (
    <div className="w-full">
      {/* Custom animations */}
      <style jsx global>{`
        .animate-on-scroll {
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .animate-on-scroll.slide-right {
          transform: translateX(-20px);
        }

        .animate-on-scroll.slide-left {
          transform: translateX(20px);
        }

        .animate-in {
          opacity: 1;
          transform: translate(0, 0);
        }
      `}</style>

      {/* Vision Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50 border-t border-t-black">
        <Container maxW="7xl">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-red-600 to-gray-900 bg-clip-text text-transparent">
              Data for the People, by the People
            </h2>
            <div className="space-y-2 text-xl bg-gradient-to-r from-red-600 to-gray-900 bg-clip-text text-transparent max-w-3xl mx-auto">
              <p>
                We are enabling communities to collect, onboard and share vital
                data from hardware devices on-chain.
              </p>
              <p className="text-lg mt-1 text-gray-600">
                Together, we're building the largest decentralized sensor
                network on BnB Greenfield
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            <div className="animate-on-scroll bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <Database className="w-12 h-12 text-red-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">
                Secure Data Storage
              </h3>
              <p className="text-gray-600">
                Powered by BNB Greenfield and Zk proofs for private collection
                and immutable storage
              </p>
            </div>

            <div className="animate-on-scroll delay-100 bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <Users className="w-12 h-12 text-red-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Community-Driven</h3>
              <p className="text-gray-600">
                From urban noise to farm health monitoring, every data point
                contributes to collective intelligence.
              </p>
            </div>

            <div className="animate-on-scroll delay-200 bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <LineChart className="w-12 h-12 text-red-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Analytics Ready</h3>
              <p className="text-gray-600">
                Transform raw data into actionable insights for smarter
                community decisions.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white border-t border-t-black">
        <Container maxW="7xl">
          <h2 className="animate-on-scroll text-4xl font-bold text-center mb-16 bg-gradient-to-r from-red-600 to-gray-900 bg-clip-text text-transparent">
            How Siren Works
          </h2>

          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-red-600 to-gray-900 hidden lg:block"></div>

            <div className="space-y-24">
              <div className="animate-on-scroll slide-right relative lg:ml-20">
                <div className="hidden lg:block absolute -left-24 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-red-600 to-gray-900"></div>
                <div className="bg-gray-50 p-8 rounded-2xl hover:shadow-lg transition-shadow">
                  <h3 className="text-2xl font-semibold mb-4">
                    Contribute Data
                  </h3>
                  <p className="text-gray-700 mb-6">
                    Connect your devices or use this web app to contribute
                    in-demand environmental data. Every recording counts.
                  </p>
                  <Button className="px-8 py-3 rounded-full bg-gradient-to-r from-red-600 to-gray-900 text-white hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
                    Start Contributing
                  </Button>
                </div>
              </div>

              <div className="animate-on-scroll slide-left relative lg:ml-20">
                <div className="hidden lg:block absolute -left-24 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-red-600 to-gray-900"></div>
                <div className="bg-gray-50 p-8 rounded-2xl hover:shadow-lg transition-shadow">
                  <h3 className="text-2xl font-semibold mb-4">
                    Earn SIRN Tokens
                  </h3>
                  <p className="text-gray-700 mb-6">
                    Get rewarded with SIRN tokens based on your data
                    contribution and consistency.
                  </p>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Coins className="w-5 h-5" />
                    <span>Tokenomics details soon</span>
                  </div>
                </div>
              </div>

              <div className="animate-on-scroll slide-right relative lg:ml-20">
                <div className="hidden lg:block absolute -left-24 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-red-600 to-gray-900"></div>
                <div className="bg-gray-50 p-8 rounded-2xl hover:shadow-lg transition-shadow">
                  <h3 className="text-2xl font-semibold mb-4">
                    Request Insights
                  </h3>
                  <p className="text-gray-700 mb-6">
                    Research Institutions and relevant stakeholders can request
                    for AI insights on aggregated data for a small fee which is
                    shared among contributors.
                  </p>
                  <Button className="px-8 py-3 rounded-full border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-300">
                    Request Access
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Organizations Section */}
      <section className="py-20 bg-gray-50 border-t border-t-black">
        <Container maxW="7xl">
          <div className="lg:flex items-center gap-12 px-4 lg:px-0">
            <div className="lg:w-1/2 mb-8 lg:mb-0 animate-on-scroll slide-right">
              <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-red-600 to-gray-900 bg-clip-text text-transparent">
                For Organizations
              </h2>
              <p className="text-xl text-gray-700 mb-8">
                Ready to join the data revolution? Connect your IoT
                infrastructure to the Siren Network to crowdsource data.
              </p>
              <div className="space-y-4">
                {/* Benefits list */}
                <div className="flex items-start gap-4 animate-on-scroll delay-100">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-red-600 to-gray-900 flex-shrink-0 mt-1"></div>
                  <p className="text-gray-700">
                    Blockchain security on BNB Greenfield
                  </p>
                </div>
                <div className="flex items-start gap-4 animate-on-scroll delay-200">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-red-600 to-gray-900 flex-shrink-0 mt-1"></div>
                  <p className="text-gray-700">Real-time data dashboard</p>
                </div>
                <div className="flex items-start gap-4 animate-on-scroll delay-300">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-red-600 to-gray-900 flex-shrink-0 mt-1"></div>
                  <p className="text-gray-700">
                    Flexible IoT device integration
                  </p>
                </div>
              </div>
              <Button className="mt-8 px-8 py-3 rounded-full bg-gradient-to-r from-red-600 to-gray-900 text-white hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
                Partner With Us
              </Button>
            </div>

            <div className="lg:w-1/2 animate-on-scroll slide-left">
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h3 className="text-2xl font-semibold mb-6">
                  Integration Process
                </h3>
                <div className="space-y-6">
                  <div className="flex items-center gap-4 animate-on-scroll delay-100">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-semibold">
                      1
                    </div>
                    <p className="text-gray-700">
                      Demo consultation and needs assessment
                    </p>
                  </div>
                  <div className="flex items-center gap-4 animate-on-scroll delay-200">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-semibold">
                      2
                    </div>
                    <p className="text-gray-700">
                      Technical integration planning
                    </p>
                  </div>
                  <div className="flex items-center gap-4 animate-on-scroll delay-300">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-semibold">
                      3
                    </div>
                    <p className="text-gray-700">
                      Deployment and call for contributors
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default WelcomeContent;
