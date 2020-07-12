export interface AppIcon {
  _id: string;
  type: string;
  name: string;
  size: number;
  color: string;
  bgColor: string;
  width: number;
  height: number;
}

export interface ServiceItemI {
  _id: string;
  is_active: boolean;
  billable: boolean;
  cover_img: string;
  thumbnail_img: string;
  app_icon: AppIcon;
  title: string;
}

export class ServiceItem implements ServiceItemI {
    _id: string;
    is_active: boolean;
    billable: boolean;
    cover_img: string;
    thumbnail_img: string;
    app_icon: AppIcon;
    title: string;
    
    constructor({_id, is_active, billable, cover_img, thumbnail_img, app_icon, title}: ServiceItemI) {
        this._id = _id;
        this.is_active = is_active;
        this.billable = billable;
        this.cover_img = cover_img;
        this.thumbnail_img = thumbnail_img;
        this.title = title;
        this.app_icon = app_icon;

        if (app_icon.type === 'svg') {
            const size = app_icon.size.toString();
            this.app_icon.width = parseInt(size.substr(0,2));
            this.app_icon.height = parseInt(size.substr(-2));
        }
    }
}