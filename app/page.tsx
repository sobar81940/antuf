// import Image from "next/image";
"use client";
import { useState } from "react";
import styles from "./page.module.css";
import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/Navbar"
import TapNav from "@/components/navbar/topnav/topnav"
import SupportChatWidget from "@/components/support/SupportChatWidget";

import ArticlesGrid from "@/components/Article/Article"
import Home from "@/components/home/Home"
import VideoContent from "@/components/home/video";
import PresidentMessage from "@/components/home/PresidentMessage";
import ImageGallery from "@/components/home/ImageGallery";
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import {
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Favorite as DonateIcon,
  Article as ArticleIcon,
  Event as EventIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

export default function HomePage() {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [presidentMessageOpen, setPresidentMessageOpen] = useState(false);

	const actions = [
		{ 
			icon: <PhoneIcon />, 
			name: 'सम्पर्क ', 
			action: () => router.push('/pages/contact')
		},
		{ 
			icon: <EmailIcon />, 
			name: 'अध्यक्षको सन्देश', 
			action: () => setPresidentMessageOpen(true)
		},
		{ 
			icon: <LocationIcon />, 
			name: 'स्थान ', 
			action: () => window.open('https://maps.google.com/?q=ALL+NEPAL+FEDERATION+OF+TRADE+UNIONS', '_blank')
		},
		{ 
			icon: <DonateIcon />, 
			name: 'दान ', 
			action: () => router.push('/donation')
		},
		{ 
			icon: <ArticleIcon />, 
			name: 'लेख', 
			action: () => router.push('/')
		},
		{ 
			icon: <EventIcon />, 
			name: 'कार्यक्रम', 
			action: () => router.push('/events')
		},
	];

	return (
		<div>
			{/* <TapNav/> */}
			<Navbar />
		
			 <Home/>
		

			
				<ArticlesGrid limit={4} showAllLink />
					 <ImageGallery />
				<VideoContent />
	
			
			<Footer />
			
			{/* Support Chat Widget for Guests and Users */}
			<SupportChatWidget />
			
			{/* President Message Popup */}
			<PresidentMessage 
				externalOpen={presidentMessageOpen}
				onExternalClose={() => setPresidentMessageOpen(false)}
			/>

			{/* Speed Dial */}
			<SpeedDial
				ariaLabel="Quick Actions"
				sx={{
					position: 'fixed',
					bottom: 75,
					right: 16,

					'& .MuiFab-primary': {
						backgroundColor: '#4caf50',
						'&:hover': {
							backgroundColor: '#45a049',
						},
					},
				}}
				icon={<SpeedDialIcon />}
				onClose={() => setOpen(false)}
				onOpen={() => setOpen(true)}
				open={open}
			>
				{actions.map((action) => (
					<SpeedDialAction
						key={action.name}
						icon={action.icon}
						tooltipTitle={action.name}
						tooltipOpen
						onClick={() => {
							action.action();
							setOpen(false);
						}}
						sx={{
							'& .MuiSpeedDialAction-fab': {
								backgroundColor: '#fff',
								'&:hover': {
									backgroundColor: '#4caf50',
									color: '#fff',
								},
							},
						}}
					/>
				))}
			</SpeedDial>
		</div>
	);
}
