import {LocaleTypes} from '@/i18n';
import {Brand, Description, Name, Resolutionimage, Translation} from '@/types';

export type Products = {
  product: Product[];
};

export type Product = {
  product: ProductClass | null;
};

export type BaseProductProps = {
  id: number;
  name: string;
  image: string;
  brand: string;
};

export type ProductLinkProps = {
  locale: LocaleTypes;
  id: number;
  name: string;
  children: React.ReactNode;
  className?: string;
};

export type ProductClass = {
  mongoDbId: string;
  summary: Summary;
  productinfolist: Productinfolist;
  specificationinfolist: Specificationinfolist;
  commercialinfolist: Commercialinfolist;
  logisticinfolist: Logisticinfolist;
};

export type ProductBrand = {
  id: string;
  name: string;
  isprivatelabel: string;
  brandownerid: string;
  brandownername: string;
  brandownergln: string;
};

export type Productinfolist = {
  productinfo: Productinfo;
};

export type Productinfo = {
  id: string;
  name: Description;
  targetmarketid: string;
  targetmarketname: Name;
  targetmarketisocode: string;
  productgroupid: string;
  productgroupname: Name;
  overalproductgroupid: string;
  overalproductgroupname: Name;
  isnonfood: string;
  countryoforiginid: string;
  countryoforiginisocode: string;
  countryoforiginname: Name;
  countryofproductionid: string;
  countryofproductionisocode: string;
  countryofproductionname: Name;
  iddsiid: string;
  iddsiname: Name;
  lastupdatedon: string;
  qualitymarkinfolist: Qualitymarkinfolist;
  fishingredientinfolist: Fishingredientinfolist;
  characteristicinfolist: Characteristicinfolist;
};

export type Allergenset = {
  allergens: Allergens;
  allergencomment: Name;
};

export type Allergens = {
  allergeninfo: Allergeninfo[];
};

export type Allergeninfo = {
  id: string;
  name: Name;
  levelofcontainmentid: string;
  levelofcontainmentname: Name;
  sequence: number;
  translation: Translation[];
};

export type Alternativegtininfolist = {
  alternativegtininfo: Alternativegtininfo;
};

export type Alternativegtininfo = {
  id: string;
  alternativegtinid: string;
  alternativegtinname: Name;
  gtin: string;
};

export type Assetinfolist = {
  assetinfo: Assetinfo[];
};

export type Assetinfo = {
  id: string;
  typeid: string;
  typename: Name;
  labelid: string;
  labelname: Name;
  facingtypeid?: string;
  facingtypename?: Name;
  angletypeid?: string;
  angletypename?: Name;
  title: Name;
  downloadurl: string;
  isdefault: string;
  availableincultures: string;
  isheroimage: string;
  maxpixelheight?: string;
  maxpixelwidth?: string;
  highresolutionimage?: Resolutionimage;
  lowresolutionimage?: Resolutionimage;
  formattypeid?: string;
  formattypename?: Name;
  externalreferenceid?: string;
  hyperlink?: string;
};

export type Catchzoneinfolist = {
  catchzoneinfo: Catchzoneinfo;
};

export type Catchzoneinfo = {
  id: string;
  faocode: string;
  name: Name;
  sequence: string;
  translation: Translation[];
};

export type Capturemethod = {
  translation: Translation[];
};

export type Characteristicinfolist = {
  characteristicinfo: Characteristicinfo[];
};

export type Characteristicinfo = {
  id: string;
  name: Name;
  isapplicable: string;
  isclaimedonlabel: string;
  friendlyname: Name;
  sequence: string;
  translation: Translation[];
};

export type Commercialinfolist = {
  commercialinfo: Commercialinfo;
};

export type Commercialinfo = {
  id: string;
  name: Description;
  legalname: Description;
  functionalname: Description;
  description: Description;
  variantdescription: Description;
  brand: Brand;
  producerid: string;
  producername: string;
  producergln: string;
  globalproductclassificationid: string;
  globalproductclassificationcode: string;
  globalproductclassificationname: Name;
  validfrom: Date;
  validto: Date;
  endavailabilitydate: Date;
  lastupdatedon: Date;
  commercialstorytext: Description;
};

export type Countryoforigins = {
  countryoforigin: Countryoforigin[] | Countryoforigin;
};

export type Countryoforigin = {
  id: string;
  name: Name;
  sequence: string;
  translation: Translation[];
};

export type Fishingredientinfolist = {
  fishingredientinfo: Fishingredientinfo[];
};

export type Fishingredientinfo = {
  id: string;
  ingredientname: Name;
  fishid: string;
  fishname: Name;
  capturemethodid: string;
  capturemethodname: Name;
  capturemethod: Capturemethod;
  countryoforiginid: string;
  countryoforiginname: Name;
  catchzoneinfolist: Catchzoneinfolist;
  translation: Translation[];
};

export type Ingredientset = {
  ingredientcomment: Description;
  isgmofree: string;
  isirradiated: string;
  ingredientdeclaration: Description;
  ingredientdeclarationpreview: Description;
  ingredients: Ingredients;
};

export type Ingredients = {
  ingredientinfo: Ingredientinfo[];
};

export type Ingredientinfo = {
  sequence: string;
  id: string;
  name: Description;
  countryoforigins: Countryoforigins;
  percentage: string;
  internalpercentage: string;
};

export type Labelcontact = {
  id: string;
  name: string;
  communicationaddress: string;
  labelcontactcommunicationchannelinfolist: Labelcontactcommunicationchannelinfolist;
};

export type Labelcontactcommunicationchannelinfolist = {
  labelcontactcommunicationchannelinfo: Labelcontactcommunicationchannelinfo;
};

export type Labelcontactcommunicationchannelinfo = {
  labelcontacttypeid: string;
  labelcontacttypename: Name;
  website: string;
  emailaddress: string;
  phonenumber: string;
  faxnumber: string;
  sequence: string;
};

export type LatestProduct = {
  id: number;
  name: string;
  image: string;
  brand: string;
};

export type Logisticinfo = {
  id: string;
  name: Description;
  gdsntradeitemdescription: Description;
  descriptionshort: Description;
  gtin: string;
  number: string;
  alternativegtininfolist: Alternativegtininfolist;
  intrastatcode: string;
  egnumber: string;
  taxrateid: string;
  taxratename: Name;
  isbaseunit: string;
  isavailableinretail: string;
  isavailableinfoodservice: string;
  isestimatedweightorvalue: string;
  isconsumerunit: string;
  isdespatchunit: string;
  isinvoiceunit: string;
  isorderableunit: string;
  isvariableunit: string;
  package: Package;
  netweightvalue: string;
  netweightuomid: string;
  netweightuomname: Name;
  netcontentvalue: string;
  netcontentuomid: string;
  netcontentuomname: Name;
  grossweightvalue: string;
  grossweightuomid: string;
  grossweightuomname: Name;
  drainedweightvalue: number;
  drainedweightuomid: string;
  drainedweightuomname: Name;
  numberofsmallerlogisticinfoitems: string;
  amountlayerperpallet: string;
  amountperpalletlayer: string;
  packagedproducttypeid: string;
  packagedproducttypename: Name;
  servingquantity: string;
  servingweightvalue: string;
  servingweightuomid: string;
  servingweightuomname: Name;
  numberofservingsperpackage: string;
  minimumnumberofservingsperpackage: string;
  maximumnumberofservingsperpackage: string;
  underlaysheet: string;
  betweensheet: string;
  coversheet: string;
  wrappingfoil: string;
  productcanbeturnedover: string;
  gtinvisibleonproductsinpallet: string;
  lastupdatedon: Date;
  labelcontact: Labelcontact;
  storageconditionset: Storageconditionset;
  microbiologicalsetinfolist: Microbiologicalsetinfolist;
  assetinfolist: Assetinfolist;
  logisticinfolist: Logisticinfolist;
};

export type Logisticinfolist = {
  logisticinfo: Logisticinfo;
};

export type Microbiologicalsetinfolist = {
  microbiologicalsetinfo: Microbiologicalsetinfo;
};

export type Microbiologicalsetinfo = {
  id: string;
  name: Name;
  microbiologicalstageid: string;
  microbiologicalstagename: Name;
  unitofmeasuretranslation: Description;
  microbiologicalstagetranslation: Translation[];
  microbiologicalorganisminfolist: Microbiologicalorganisminfolist;
};

export type Microbiologicalorganisminfolist = {
  microbiologicalorganisminfo: Microbiologicalorganisminfo[];
};

export type Microbiologicalorganisminfo = {
  id: string;
  name: Description;
  measurementprecisionid: string;
  measurementprecisionname: Description;
  value: string;
  unitofmeasureid: string;
  unitofmeasurename: Description;
  sequence: string;
  translation: Translation[];
  unitofmeasuretranslation: Translation[];
};

export type Nutrientset = {
  nutrientcomment: Description;
  dailyvalueintakereferencecomment: Description;
  nutrientinfolist: Nutrientinfolist;
};

export type Nutrientinfolist = {
  nutrientinfo: Nutrientinfo[];
};

export type NutrientInfoSimple = {
  id: string;
  name: string;
  translation: Translation[];
  parentid: string;
  product?: Nutrient;
  prepared?: Nutrient;
};

export type NutrientDisplayInfo = {
  isActive: boolean;
  showHunderd: boolean;
  showGDA: boolean;
  showPortion: boolean;
};

export type Nutrientinfo = {
  id: string;
  stateofpreparationid: string;
  stateofpreparationname: Name;
  perhunderduomid: string;
  perhunderduomname: Name;
  servingunitvalue: string;
  servinguomid: string;
  servinguomname: Name;
  nutrients: Nutrients;
};

export type Nutrients = {
  nutrient: Nutrient[];
};

export type Nutrient = {
  id: string;
  name: Name;
  measurementprecisionid: string;
  measurementprecisionname: Name;
  value?: number;
  valueperserving?: number;
  decimalvalue: number;
  decimalvalueperserving?: number;
  guidelinedailyamount?: number;
  unitofmeasureid: string;
  unitofmeasurename: Name;
  sequence?: string;
  roundby?: string;
  translation: Translation[];
  parentid?: string;
};

export type Organolepticcharacteristicset = {
  organolepticcharacteristicinfolist: Organolepticcharacteristicinfolist;
};

export type Organolepticcharacteristicinfolist = {
  organolepticcharacteristicinfo: Organolepticcharacteristicinfo[];
};

export type Organolepticcharacteristicinfo = {
  id: string;
  name: Description;
  description: Description;
};

export type Package = {
  id: string;
  name: Description;
  packagingtypeid: string;
  packagingtypename: Name;
  depthvalue: number;
  depthuomid: string;
  depthuomname: Name;
  heightvalue: number;
  heightuomid: string;
  heightuomname: Name;
  widthvalue: number;
  widthuomid: string;
  widthuomname: Name;
  weightuomid: string;
  weightuomname: Name;
  weightvalue?: number;
  depositapplies?: string;
  depositamount?: number;
  isprimarypackage?: string;
  packagingmaterialinfolist?: Packagingmaterialinfolist;
};

export type Packagingmaterialinfolist = {
  packagingmaterialinfo:
    | PackagingmaterialinfoElement[]
    | PackagingmaterialinfoElement;
};

export type PackagingmaterialinfoElement = {
  id: string;
  name: Name;
  value?: number;
  unitofmeasureid?: string;
  unitofmeasurename?: Name;
  isrecyclable?: string;
  percentagerecycledmaterial?: number;
  comment: Name;
};

export type Preparationinformationset = {
  preparationinformationinfolist: Preparationinformationinfolist;
};

export type Preparationinformationinfolist = {
  preparationinformationinfo: Preparationinformationinfo[];
};

export type Preparationinformationinfo = {
  id: string;
  preparationtypeid: string;
  preparationtypename: Name;
  preparationdescription: Description;
};

export type Physiochemicalcharacteristicset = {
  physiochemicalcharacteristicinfolist: Physiochemicalcharacteristicinfolist;
};

export type Physiochemicalcharacteristicinfolist = {
  physiochemicalcharacteristicinfo: Physiochemicalcharacteristicinfo[];
};

export type Physiochemicalcharacteristicinfo = {
  id: string;
  name: Name;
  valuefrom: string;
  valueto: string;
  unitofmeasureid: string;
  unitofmeasurename: Name;
  sequence: string;
  translation: Description;
};

export type Qualitymarkinfolist = {
  qualitymarkinfo: Qualitymarkinfo[];
};

export type Qualitymarkinfo = {
  id: string;
  name: Name;
  logo?: string;
};

export type Specificationinfolist = {
  specificationinfo: Specificationinfo;
};

export type Specificationinfo = {
  id: string;
  productionlocationid: string;
  productionlocationname: string;
  productionlocationgln: string;
  lastupdatedon: Date;
  specificationstatusname: Name;
  validfrom: Date;
  lastvalidatedon: Date;
  percentagefruit: string;
  percentagevegetable: string;
  percentagemeat: string;
  percentagefish: string;
  percentagenuts: string;
  ingredientset: Ingredientset;
  allergenset: Allergenset;
  nutrientset: Nutrientset;
  preparationinformationset: Preparationinformationset;
  organolepticcharacteristicset: Organolepticcharacteristicset;
  physiochemicalcharacteristicset: Physiochemicalcharacteristicset;
};

export type Storageconditionset = {
  comment: Description;
  usageinstructionlabel: Description;
  storageinstructionlabel: Description;
  preservationtechniqueid: string;
  preservationtechniquename: Name;
  shelflifelocationtext: Description;
  shelflifeid: string;
  shelflifename: Description;
  schelflife: Translation[];
  storageconditionstageinfolist: Storageconditionstageinfolist;
};

export type Storageconditionstageinfolist = {
  storageconditionstageinfo: Storageconditionstageinfo[];
};

export type Storageconditionstageinfo = {
  id: string;
  name: Name;
  storageconditioninfolist: Storageconditioninfolist;
};

export type Storageconditioninfolist = {
  storageconditioninfo: Storageconditioninfo;
};

export type Storageconditioninfo = {
  id: string;
  name: Name;
  mintemperature: number;
  maxtemperature: number;
  periodvalue: number;
  periodid: string;
  periodname: Name;
  comment: Description;
};

export type Summary = {
  id: string;
  name: Name;
  ean: string;
  netweight: string;
  netweightunitofmeasure: Name;
  netcontent: string;
  netcontentunitofmeasure: Name;
  brandid: string;
  brandname: string;
  lastupdatedon: Date;
  packshot: string;
  publiclyvisible: string;
  targetmarketid: string;
  targetmarketisocode: string;
};

export enum ContainmentLevel {
  Contains = 'bevat',
  MayContain = 'kan bevatten',
  Without = 'bevat niet',
  NotSupplied = 'niet opgegeven',
}

export type AllergenId = string;
export const tabbedAllergens: AllergenId[] = [
  '6',
  '7',
  '27',
  '28',
  '29',
  '30', // Granen
  '31',
  '32',
  '33',
  '34',
  '35',
  '36',
  '37',
  '38', // Noten
];
