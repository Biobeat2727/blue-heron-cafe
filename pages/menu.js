// pages/menu.js
import MenuSection from "@/components/MenuSection";
import SEO from "@/components/SEO";
import { getAllMenuItems } from "@/lib/sanity";

export default function MenuPage({ menuItems }) {
  const categories = [
    { key: "breakfast", title: "Breakfast", image: "/images/menu-categories/breakfast.jpg" },
    { key: "lunch", title: "Lunch", image: "/images/menu-categories/lunch.jpg" },
    { key: "dinner", title: "Dinner", image: "/images/menu-categories/dinner.jpg" },
    { key: "baked", title: "Desserts", image: "/images/menu-categories/dessert.jpg" },
    { key: "sides", title: "Morning Sides", image: "/images/menu-categories/sides.jpg" },
  ];

  return (
    <>
      <SEO
        title="Menu | Blue Heron Café"
        description="Browse our cozy café offerings — from hearty breakfasts to fresh lunches and baked goods."
      />

      {categories.map((section) => (
        <MenuSection
          key={section.key}
          title={section.title}
          imageSrc={section.image}
          items={menuItems.filter((item) => item.category === section.key)}
        />
      ))}
    </>
  );
}

export async function getStaticProps() {
  const menuItems = await getAllMenuItems();
  return {
    props: { menuItems },
    revalidate: 60,
  };
}
