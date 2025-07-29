import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="mt-20">
      {/* Hero Section */}
      <div className="text-center py-20 px-5">
        <h1 className="text-4xl font-black mb-6">About BlogHub</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          The story behind the platform that&apos;s empowering writers to share their voices with the world.
        </p>
      </div>

      {/* Founder Story */}
      <div className="py-20 px-5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="w-32 h-32 bg-primary rounded-full mx-auto mb-6 flex items-center justify-center text-4xl font-bold text-primary-content">
              MJ
            </div>
            <h2 className="text-3xl font-bold mb-4">Meet Marcus Johnson</h2>
            <p className="text-xl text-gray-600">Founder & Creator of BlogHub</p>
          </div>

          <div className="prose prose-lg mx-auto">
            <p className="text-lg leading-relaxed mb-6">
              In 2023, I found myself frustrated with the complexity of existing blogging platforms. As a software engineer who loved writing about technology, I wanted to share my thoughts with friends and family, but every platform I tried was either too complicated, too expensive, or too restrictive.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              I remember the exact moment the idea for BlogHub was born. I was trying to help my grandmother set up a blog to share her family recipes and stories. She wanted something simple - just a place to write and share with her loved ones. But every platform we tried required technical knowledge she didn&apos;t have, or forced her to pay for features she didn&apos;t need.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              That&apos;s when I realized there was a gap in the market. There were platforms for professional bloggers, platforms for businesses, but nothing simple and beautiful for everyday people who just wanted to share their stories, recipes, travel adventures, or thoughts with the world.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              So I decided to build it myself. BlogHub was created with one simple principle: <strong>everyone deserves a beautiful, simple way to share their voice online.</strong> No technical knowledge required. No hidden fees. No complicated features. Just write, publish, and share.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              What started as a personal project has grown into a community of thousands of writers, storytellers, and creators. From grandmothers sharing family recipes to students documenting their study abroad adventures, from tech enthusiasts writing tutorials to artists sharing their creative process - BlogHub has become a home for authentic voices.
            </p>

            <p className="text-lg leading-relaxed">
              Today, I&apos;m proud to see how BlogHub has evolved. It&apos;s not just a platform anymore - it&apos;s a community where people connect through stories, where voices that might never have been heard find their audience, and where the simple act of sharing creates meaningful connections.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-20 px-5 bg-base-200">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Our Mission</h2>
          <p className="text-xl text-gray-600 mb-8">
            To democratize storytelling by providing everyone with a simple, beautiful platform to share their voice and connect with others through authentic, meaningful content.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div>
              <h3 className="text-xl font-semibold mb-3">Simplicity</h3>
              <p className="text-gray-600">We believe great tools should be invisible. Focus on your content, not the technology.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Authenticity</h3>
              <p className="text-gray-600">Real stories from real people. No algorithms, no clickbait, just genuine human connection.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Community</h3>
              <p className="text-gray-600">Building bridges between writers and readers, creating meaningful connections through shared stories.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-20 px-5">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
          <p className="text-lg text-gray-600 mb-8">
            Have questions, suggestions, or just want to say hello? I&apos;d love to hear from you.
          </p>
          <div className="flex gap-4 justify-center">
            <a href="mailto:marcus@bloghub.com" className="btn btn-primary">
              Email Marcus
            </a>
            <Link href="/posts" className="btn btn-outline">
              Explore Our Community
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 