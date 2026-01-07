import { PublicNavbar } from "@/shared/Public/PublicNavbar";


const CommonLayout = ({children}: {children: React.ReactNode}) => {
    return (
        <div>
            <PublicNavbar/>
            {children}
        </div>
    );
};

export default CommonLayout;