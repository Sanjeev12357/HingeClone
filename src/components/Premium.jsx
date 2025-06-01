import axios from 'axios';
import React, { useEffect } from 'react';
import { BASE_URL } from '../utils/constants';

const Premium = () => {
  const features = [
    {
      icon: "💬",
      title: "Chat with Other People",
      description:
        "Connect instantly with thousands of genuine members. Share stories, laugh together, and build meaningful connections through our intuitive messaging system.",
    },
    {
      icon: "📊",
      title: "100 Connection Requests per Day",
      description:
        "Maximize your chances of finding love with generous daily connection limits. Send up to 100 meaningful connection requests to potential matches every single day.",
    },
    {
      icon: "🔥",
      title: "Blue Tick Verification",
      description:
        "Stand out with our exclusive verification badge. Show others you're a serious, authentic member while enjoying priority visibility in search results.",
    },
  ];

  const [isPremium, setIsPremium] = React.useState(false);

  useEffect(() => {
    verifyPremiumUser();
  }, []);

  const verifyPremiumUser = async () => {
    try {
      const res = await axios.get(BASE_URL + "/premium/verify", {
        withCredentials: true,
      });
      if (res.data.isPremium) {
        setIsPremium(true);
      }
    } catch (err) {
      console.error("Verification failed", err);
    }
  };

  const handleBuyClick = async () => {
    try {
      const order = await axios.post(
        BASE_URL + "/payment/create",
        {
          memebershipType: "premium",
          amount: 1000, // amount in paise
        },
        {
          withCredentials: true,
        }
      );

      const { amount, currency, notes, orderId } = order.data;

      const options = {
        key: "rzp_test_8D5DwZyENmZRU2",
        currency,
        amount,
        order_id: orderId,
        name: "deto",
        description: "Thank you for purchasing Premium Membership",
        prefill: {
          name: notes.firstName,
          email: notes.emailId,
        },
        theme: {
          color: "#3399cc",
        },
        handler: function () {
          verifyPremiumUser();
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment failed", err);
    }
  };

  return (
    <div>
      {isPremium ? (
        // 🎉 Premium Confirmation UI
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex flex-col items-center justify-center text-center p-6">
          <div className="w-24 h-24 mb-6">
            <div className="relative w-full h-full">
              <div className="absolute inset-0 rounded-full border-4 border-green-500 animate-ping"></div>
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-green-500 text-white text-4xl shadow-lg">
                ✓
              </div>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-400 via-pink-500 to-red-500 bg-clip-text text-transparent animate-fade-in-up">
            You're Now a Premium Member!
          </h1>
          <p className="mt-4 text-gray-300 text-lg max-w-xl animate-fade-in-up animation-delay-200">
            Congratulations! Enjoy exclusive features like chat, 100+ connections daily, and blue tick verification.
          </p>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="mt-8 bg-gradient-to-r from-pink-600 via-red-500 to-yellow-400 hover:scale-105 transform transition px-8 py-3 rounded-full text-black font-bold shadow-lg"
          >
            Explore Premium Features
          </button>
        </div>
      ) : (
        // 🧩 Premium Purchase UI
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
              Premium Features
            </h2>
            <p className="text-gray-400 text-center text-lg mb-12 max-w-2xl mx-auto">
              Discover what makes our dating platform special with these exclusive features
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group relative bg-black/40 backdrop-blur-lg border border-gray-800 hover:border-gray-600 rounded-2xl p-8 transition-all duration-300 hover:transform hover:-translate-y-3 hover:bg-black/60 hover:shadow-2xl hover:shadow-white/10"
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white via-gray-400 to-white opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10 blur-sm"></div>

                  <div className="relative z-10">
                    <div className="text-6xl mb-6 text-center group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>

                    <h3 className="text-xl font-bold text-white mb-4 text-center group-hover:text-gray-200 transition-colors duration-300">
                      {feature.title}
                    </h3>

                    <p className="text-gray-400 leading-relaxed text-center group-hover:text-gray-300 transition-colors duration-300">
                      {feature.description}
                    </p>
                  </div>

                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-16">
              <button
                onClick={handleBuyClick}
                className="bg-black hover:bg-gray-900 border border-gray-700 hover:border-gray-500 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-white/10"
              >
                Get Started Today
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Premium;
