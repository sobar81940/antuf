# Organization Dashboard - Committee Structure Enhancement

## Overview
Enhanced the admin organization dashboard to allow changing committee structure and adding province/district names **after members have been assigned**. This provides greater flexibility in managing committee hierarchies.

## Changes Made

### 1. Database Model Update
**File**: `/models/Committee.ts`

Added four new optional fields to the Committee schema:
- `provinceName` (String) - Province name in Nepali
- `provinceNameEn` (String) - Province name in English  
- `districtName` (String) - District name in Nepali
- `districtNameEn` (String) - District name in English

These fields are optional and can be populated for Provincial and District committees.

### 2. API Endpoint Updates
**Files**: 
- `/app/api/admin/associations/[id]/committees/route.ts` (POST)
- `/app/api/admin/associations/[id]/committees/[committeeId]/route.ts` (PATCH)

Both endpoints now:
- Accept the new province and district name fields
- Store them in the database when creating or updating committees
- Support editing structure after members are assigned

### 3. UI/Dashboard Enhancements
**File**: `/app/dashboard/admin/organization/[id]/page.tsx`

#### New State Variables
```typescript
const [provinceName, setProvinceName] = useState("");
const [provinceNameEn, setProvinceNameEn] = useState("");
const [districtName, setDistrictName] = useState("");
const [districtNameEn, setDistrictNameEn] = useState("");
```

#### Enhanced "Add Committee" Dialog
- Added "Location Information" section (only shows for provincial/district committees)
- Fields for both Nepali and English province names
- Fields for both Nepali and English district names
- Conditional display based on committee type selected

#### Enhanced "Edit Committee" Dialog
- Renamed to "Edit Committee Structure & Details" (more descriptive)
- Shows a warning alert if committee has members assigned
- Allows changing committee type/structure even with existing members
- Same location information fields as add dialog
- Better visual feedback that structure can be changed after member assignment

#### Committee Card Display
- Now displays province and district information below committee name
- Shows emoji indicators (📍) for location information
- Displays both Nepali and English names if provided
- Better visual organization of information

### 4. Features

✅ **Change Structure After Members Added**
- Users can modify the committee type (central, provincial, district, etc.) even after members have been assigned
- Alert message warns users that members are already assigned

✅ **Province & District Information**
- Add location context to provincial and district committees
- Support for both Nepali and English names
- Optional fields (can be empty)

✅ **Better UI/UX**
- Larger dialog (maxWidth: "sm" instead of "xs") for better layout
- Conditional display of location fields based on committee type
- Clear section dividers and labels
- Visual indicators in committee cards

✅ **Backward Compatible**
- All new fields are optional
- Existing committees work without any changes
- Graceful handling of missing data

## Usage

### Creating a Committee with Location Info
1. Go to Admin Dashboard → Organization
2. Click "Add Committee"
3. Select "Provincial Committee" or "District Coordination Committee"
4. Fill in committee name
5. Fill in Province and/or District names (in Nepali and English)
6. Click "Add"

### Changing Structure After Adding Members
1. Click the Edit (pencil) icon on any committee card
2. Dialog shows: "⚠️ This committee has X members. You can still change the structure and names."
3. Change committee type, names, or location information
4. Click "Save Changes"
5. All changes are saved immediately

## API Examples

### Create Provincial Committee with Location Info
```bash
POST /api/admin/associations/[associationId]/committees

{
  "name": "बाग्मती प्रदेश समिति",
  "nameEn": "Bagmati Provincial Committee",
  "type": "provincial",
  "provinceName": "बाग्मती प्रदेश",
  "provinceNameEn": "Bagmati Province",
  "districtName": "काठमाडौं",
  "districtNameEn": "Kathmandu"
}
```

### Update Existing Committee Structure
```bash
PATCH /api/admin/associations/[associationId]/committees/[committeeId]

{
  "name": "सिंधुपाल्चोक जिल्ला समन्वय समिति",
  "nameEn": "Sindhupalchok District Coordination Committee",
  "type": "district",
  "provinceName": "बाग्मती प्रदेश",
  "provinceNameEn": "Bagmati Province",
  "districtName": "सिंधुपाल्चोक",
  "districtNameEn": "Sindhupalchok"
}
```

## Testing Checklist

✅ TypeScript compilation passes  
✅ Add committee with location info  
✅ Edit committee to change type after members assigned  
✅ Display province/district info on committee cards  
✅ Backward compatibility with existing committees  
✅ All fields optional  
✅ Location section only shows for relevant committee types  

## Files Modified

1. `/models/Committee.ts` - Added location fields to schema
2. `/app/api/admin/associations/[id]/committees/route.ts` - POST endpoint updated
3. `/app/api/admin/associations/[id]/committees/[committeeId]/route.ts` - PATCH endpoint updated  
4. `/app/dashboard/admin/organization/[id]/page.tsx` - UI enhancements

## Deployment Notes

- No data migration needed (new fields are optional)
- Backward compatible with existing data
- No breaking changes to API
- Update production database schema if using MongoDB compass or similar tool
