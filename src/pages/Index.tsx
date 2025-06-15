
import ArticleCard from "@/components/ArticleCard";
import CourseCard from "@/components/CourseCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const sampleArticles = [
  {
    slug: "start-cafe-business",
    title: "อยากเปิดร้านกาแฟ? เริ่มต้นอย่างไรให้ไม่เจ๊ง",
    excerpt: "รวมขั้นตอนสำหรับมือใหม่ ตั้งแต่การวางแผน การหาทำเล ไปจนถึงการตลาดวันเปิดร้าน",
    category: "ไอเดียธุรกิจ",
    imageUrl: "https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=500&q=80",
  },
  {
    slug: "basic-online-marketing",
    title: "การตลาดออนไลน์ 101 สำหรับเจ้าของธุรกิจมือใหม่",
    excerpt: "รู้จักเครื่องมือการตลาดดิจิทัลที่จำเป็น เพื่อให้ร้านค้าของคุณเป็นที่รู้จักในวงกว้าง",
    category: "การตลาด",
    imageUrl: "https://images.unsplash.com/photo-1557862921-37829c790f19?w=500&q=80",
  },
  {
    slug: "business-model-canvas",
    title: "รู้จัก Business Model Canvas เครื่องมือวางแผนธุรกิจใน 1 หน้า",
    excerpt: "วิธีใช้ BMC เพื่อให้เห็นภาพรวมธุรกิจของคุณได้ชัดเจนและง่ายที่สุด",
    category: "วางแผนธุรกิจ",
    imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=500&q=80",
  },
];

const sampleCourses = [
  {
    slug: "from-idea-to-income",
    title: "คอร์สปั้นไอเดียให้เป็นเงิน: สร้างธุรกิจแรกใน 30 วัน",
    description: "คอร์สออนไลน์ที่จะพาคุณจับมือทำตั้งแต่คิดไอเดีย, ทดสอบตลาด, จนมีรายได้แรก",
    price: 1990,
    imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&q=80",
  },
  {
    slug: "facebook-ads-for-beginner",
    title: "Facebook Ads สำหรับมือใหม่: ยิงแอดอย่างไรให้ตรงกลุ่มเป้าหมาย",
    description: "เรียนรู้การใช้ Facebook Ads Manager, กำหนดกลุ่มเป้าหมาย, และสร้างโฆษณาที่ได้ผลจริง",
    price: 2490,
    imageUrl: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=500&q=80",
  },
];

const Index = () => {
  return (
    <div className="space-y-16 md:space-y-24">
      {/* Hero Section */}
      <section className="text-center py-16 md:py-24">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          เปลี่ยน <span className="text-primary">ไอเดีย</span> ให้เป็น <span className="text-primary">ธุรกิจ</span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Begins Guide คือเพื่อนคู่คิดสำหรับผู้ที่อยากเริ่มต้น เรามีทั้งความรู้, เครื่องมือ, และคอร์สออนไลน์ที่จะนำทางคุณไปสู่ความสำเร็จ
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button size="lg" asChild>
            <Link to="/courses">ดูคอร์สทั้งหมด</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/articles">อ่านบทความฟรี</Link>
          </Button>
        </div>
      </section>

      {/* Featured Articles */}
      <section>
        <h2 className="text-3xl font-bold text-center">บทความน่าสนใจ</h2>
        <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {sampleArticles.map((article) => (
            <ArticleCard key={article.slug} {...article} />
          ))}
        </div>
        <div className="text-center mt-8">
            <Button variant="ghost" asChild>
                <Link to="/articles">อ่านบทความทั้งหมด &rarr;</Link>
            </Button>
        </div>
      </section>

      {/* Featured Courses */}
      <section>
        <h2 className="text-3xl font-bold text-center">คอร์สออนไลน์แนะนำ</h2>
        <div className="mt-8 grid gap-8 md:grid-cols-2">
            {sampleCourses.map((course) => (
                <CourseCard key={course.slug} {...course} />
            ))}
        </div>
        <div className="text-center mt-8">
            <Button variant="ghost" asChild>
                <Link to="/courses">ดูคอร์สทั้งหมด &rarr;</Link>
            </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;

