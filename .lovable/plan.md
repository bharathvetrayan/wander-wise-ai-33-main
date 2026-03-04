
# Restructure Website for Tamil Nadu & Indian Cultural Focus

## Overview
Transform the travel platform from a generic global travel site to one specifically focused on Tamil Nadu and Indian cultural tourism. This involves removing the Food Guide section, eliminating generic statistics, and updating all content to highlight Tamil Nadu destinations, culture, and experiences.

---

## Changes Summary

### 1. Remove Food Guide Feature
- Delete the `/food` route from `App.tsx`
- Remove Food Guide link from `Navbar.tsx`
- Remove Food Guide reference from `Footer.tsx`
- Delete `src/pages/FoodGuide.tsx` file

### 2. Update Homepage (HeroSection.tsx)

**Remove Statistics Section:**
- Remove the stats array containing "50K+ Trips Planned", "180+ Countries", "4.9/5 User Rating", "24/7 AI Support"
- Remove the entire stats grid display from the hero section

**Update Trust Section:**
- Change "180+ countries and destinations" to focus on Tamil Nadu districts and destinations
- Update messaging to highlight Indian cultural heritage

**Update Content for Tamil Nadu Focus:**
- Change tagline to emphasize Tamil Nadu tourism
- Update hero description to focus on exploring Tamil Nadu's temples, culture, and heritage
- Update features to be more relevant to Indian/Tamil Nadu travel

### 3. Update Features Section
Update the 6 features to reflect Tamil Nadu focus:
- AI-Powered Itineraries (keep, update description)
- Interactive Maps (keep, update for Tamil Nadu locations)
- Local Food Guide will be renamed to "Temple & Heritage Guide"
- Currency Converter (update for INR focus)
- Smart Scheduling (update for festival dates)
- Multi-Destination will become "District Explorer" for Tamil Nadu districts

### 4. Update Navbar & Footer
- Remove Food Guide navigation link
- Update branding from "TravelAI" to "Tamil Nadu Explorer" or similar
- Update footer tagline for Tamil Nadu focus

### 5. Update Chatbot Suggested Questions
Change demo questions to Tamil Nadu-specific:
- "Best temples to visit in Tamil Nadu?"
- "What are famous dishes in Chennai?"
- "When is the best time to visit Mahabalipuram?"
- "How to plan a heritage tour in Tamil Nadu?"

### 6. Update Itinerary Demo Data
Update demo itinerary activities to reflect Tamil Nadu experiences:
- Temple visits (Meenakshi Temple, Brihadeeswara Temple)
- South Indian breakfast (Idli, Dosa, Filter Coffee)
- Cultural experiences (Bharatanatyam shows, silk weaving)
- Local markets (T. Nagar, Pondy Bazaar)

### 7. Update Travel Map Demo Locations
Change demo locations to Tamil Nadu places:
- Chennai, Madurai, Thanjavur, Mahabalipuram, Kanchipuram, Ooty, Kodaikanal

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/App.tsx` | Remove FoodGuide import and route |
| `src/components/Navbar.tsx` | Remove Food Guide link, update branding |
| `src/components/Footer.tsx` | Remove Food Guide reference, update branding |
| `src/components/home/HeroSection.tsx` | Remove stats, update all content for Tamil Nadu |
| `src/pages/Chatbot.tsx` | Update suggested questions and demo responses |
| `src/components/travel/ItineraryDisplay.tsx` | Update demo activities for Tamil Nadu |
| `src/components/travel/TravelMap.tsx` | Update demo locations for Tamil Nadu |

## File to Delete
| File | Reason |
|------|--------|
| `src/pages/FoodGuide.tsx` | Feature removed as requested |

---

## Technical Details

### Updated Branding
- App Name: "Tamil Nadu Explorer" or "TN Travel AI"
- Tagline: "Discover the Soul of South India"
- Primary focus: Temple tourism, heritage sites, cultural experiences

### Tamil Nadu Destinations to Feature
- Chennai (Marina Beach, Kapaleeshwarar Temple)
- Madurai (Meenakshi Amman Temple)
- Thanjavur (Brihadeeswara Temple)
- Mahabalipuram (Shore Temple, Rock Monuments)
- Kanchipuram (Silk sarees, Temples)
- Ooty & Kodaikanal (Hill stations)
- Rameswaram (Ramanathaswamy Temple)
- Pondicherry (French Quarter)

### Updated Trust Indicators
- "38 Districts" instead of "180+ Countries"
- "UNESCO Heritage Sites"
- "Ancient Temple Trail"

### Color Palette Consideration
Keep the existing ocean blue theme as it works well with Tamil Nadu's coastal heritage (Marina Beach, temple tank blues). Optionally could add saffron/vermilion accents for temple aesthetic.

---

## Implementation Order
1. Remove Food Guide route and navigation
2. Update HeroSection with Tamil Nadu content
3. Update Navbar and Footer branding
4. Update Chatbot for Tamil Nadu responses
5. Update demo data in ItineraryDisplay and TravelMap
