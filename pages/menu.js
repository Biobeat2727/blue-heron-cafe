// pages/menu.js
import MenuSection from "@/components/MenuSection";
import SEO from "@/components/SEO";
import { getAllMenuItems } from "@/lib/sanity";

export default function MenuPage({ menuItems }) {
  return (
    <>
      <SEO
        title="Menu | Blue Heron Café"
        description="Browse our cozy café offerings — from hearty breakfasts to fresh lunches and baked goods."
      />

      <MenuSection
        title="Breakfast"
        imageSrc="/images/menu-categories/breakfast.jpg"
        items={menuItems.filter(
          (item) => item.category === "breakfast" || item.category === "sides"
        )}
      />

      <MenuSection
        title="Lunch"
        imageSrc="/images/menu-categories/lunch.jpg"
        items={menuItems.filter((item) => item.category === "lunch")}
      />

      <MenuSection
        title="Dinner"
        imageSrc="/images/menu-categories/dinner.jpg"
        items={menuItems.filter((item) => item.category === "dinner")}
      />

      <MenuSection
        title="Desserts"
        imageSrc="/images/menu-categories/dessert.jpg"
        items={menuItems.filter((item) => item.category === "baked")}
      />
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
