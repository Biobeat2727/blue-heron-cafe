// pages/menu.js - Menu page with SEO
import MenuSection from "@/components/MenuSection";
import SEO from "@/components/SEO";
import { generateMenuSchema, generateBreadcrumbSchema } from "@/lib/structuredData";
import { getAllMenuItems } from "@/lib/sanity";

export default function MenuPage({ menuItems }) {
  const menuSchema = generateMenuSchema(menuItems);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://blueheronsamuels.com/" },
    { name: "Menu", url: "https://blueheronsamuels.com/menu" }
  ]);

  return (
    <>
      <SEO
        title="Menu | Blue Heron Café - Fresh Breakfast, Lunch & Dinner in Samuels, ID"
        description="Browse our menu of fresh, elevated homestyle cuisine. Breakfast served all day, gourmet lunch options, and dinner specials. Farm-to-table ingredients in Samuels, Idaho."
        keywords="Blue Heron menu, breakfast Samuels Idaho, lunch Sandpoint, farm to table restaurant, fresh food menu, country dining Idaho"
        url="/menu"
        jsonLd={[menuSchema, breadcrumbSchema]}
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
        title="Tidbits"
        imageSrc="/images/menu-categories/tidbits.jpg"
        items={menuItems.filter((item) => item.category === "tidbits")}
        />

      <MenuSection
        title="Dinner"
        imageSrc="/images/menu-categories/dinner.jpg"
        items={menuItems.filter((item) => item.category === "dinner")}
      />

      <MenuSection
        title="Desserts"
        imageSrc="/images/menu-categories/dessert.jpg"
        items={menuItems.filter((item) => item.category === "desserts")}
      />
      <MenuSection 
        title="Drinks"
        imageSrc="/images/menu-categories/drinks.jpg"
        items={menuItems.filter((item) => item.category === "drinks")}
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