import DashboardCardUI, {
  type DashboardCardProps,
} from "@/components/ui/dashboard-card";

interface AdminAnalyticsStatsProps {
  cards: DashboardCardProps[];
}

const AdminAnalyticsStats = ({ cards }: AdminAnalyticsStatsProps) => {
  return (
    <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => (
        <DashboardCardUI
          key={card.description}
          description={card.description}
          value={card.value}
          badgeText={card.badgeText}
          badgeIcon={card.badgeIcon}
          footerText={card.footerText}
          footerSubText={card.footerSubText}
        />
      ))}
    </section>
  );
};

export default AdminAnalyticsStats;
