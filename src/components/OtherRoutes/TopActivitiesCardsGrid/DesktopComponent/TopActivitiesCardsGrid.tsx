import ActivityCard from '@/components/CommonComponents/ActivityCard/ActivityCard';
import { bestSellerActivities } from '../../../HomePageRoutes/BestSellers/CommonValues';
import "../TopActivitiesCardsGrid.css";

const TopActivitiesCardsGrid = () => {
    return (
        <div id="TopActivitiesCardsGrid" className="MaxWidthComponent MarginAuto PaddingTop30 PaddingBottom30">
            <h2 className="SecondaryHeadingFont">Top Activities</h2>
            <div className="ActivitiesGrid PaddingTop30">
                {bestSellerActivities.map((activity) => (
                    <ActivityCard key={activity.id} activity={activity} />
                ))}
            </div>
        </div>
    );
};

export default TopActivitiesCardsGrid;