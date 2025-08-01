import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 flex flex-col items-center p-6">
      {/* Header */}
      <header className="w-full max-w-7xl flex justify-between items-center mb-10">
        <div className="flex items-center">
          <img src="/logo2.png" alt="AgilePM Logo" className="h-16 mr-4" />
          <h1 className="text-3xl font-extrabold text-gray-800">AgilePM Platform</h1>
        </div>
        <div className="flex gap-3">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow">Get Started</button>
          <Link to="/" className="bg-white hover:bg-gray-200 text-blue-600 border border-blue-600 px-4 py-2 rounded-xl shadow">Log in</Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-7xl bg-white shadow-2xl rounded-3xl p-10 flex flex-col gap-10">
        <section>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Your Agile Project Management Solution</h2>
        </section>

        {/* Features */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              to: "/calendar",
              icon: "📅",
              title: "Smart Calendar",
              desc: "Plan sprints, schedule meetings, and track deadlines with our intuitive calendar.",
              img: "/calendar.png",
            },
            {
              to: "/kanban",
              icon: "📋",
              title: "Kanban Board",
              desc: "Visualize your workflow with customizable Kanban boards that help your team stay focused.",
              img: "/kanban.png",
            },
            {
              to: "/analytics",
              icon: "📊",
              title: "Project Analytics",
              desc: "Make data-driven decisions with comprehensive analytics that measure team velocity.",
              img: "/analytics.png",
            },
          ].map((card, index) => (
            <Link
              key={index}
              to={card.to}
              className="bg-gray-50 hover:bg-white transition p-6 rounded-xl shadow-md flex flex-col items-center text-center"
            >
              <span className="text-4xl text-blue-500 mb-3">{card.icon}</span>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{card.title}</h3>
              <p className="text-gray-600 mb-4">{card.desc}</p>
              <img src={card.img} alt={card.title} className="w-full h-40 object-cover rounded-lg" />
            </Link>
          ))}
        </section>

        {/* Why Teams Love AgilePM */}
        <section className="bg-blue-100 p-8 rounded-2xl shadow">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Why Teams Love AgilePM</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: "⏳",
                title: "Streamlined Agile Processes",
                desc: "Support for Scrum, Kanban, and hybrid methodologies.",
              },
              {
                icon: "📈",
                title: "Increased Productivity",
                desc: "Teams report up to 40% faster delivery.",
              },
              {
                icon: "💬",
                title: "Enhanced Collaboration",
                desc: "Real-time updates, comments, and notifications.",
              },
              {
                icon: "🔗",
                title: "Seamless Integrations",
                desc: "Works with GitHub, Slack, and Google Workspace.",
              },
            ].map((item, index) => (
              <div className="flex items-start gap-4" key={index}>
                <span className="text-blue-600 text-3xl">{item.icon}</span>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">{item.title}</h4>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
