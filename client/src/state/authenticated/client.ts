import { observable } from "mobx";
import { Authenticated } from "../authenticating";
import { ListingApartments } from "./states/apartments/listing";
import { Home } from "./states/home";
import { DeletingSelf } from "./states/users/deleting-self";
import { UpdatingSelf } from "./states/users/updating-self";

export class AuthenticatedClient {
  public readonly kind = "authenticated-client";

  @observable
  public state:
    | Home
    | ListingApartments
    | UpdatingSelf
    | DeletingSelf = new Home();
  public readonly signOut: () => void;

  private readonly authenticated: Authenticated;

  public constructor(authenticated: Authenticated, callbacks: Callbacks) {
    this.authenticated = authenticated;
    this.signOut = callbacks.signOut;
  }

  public listApartments = async () => {
    this.state = new ListingApartments(this.authenticated);
    await this.state.loadFresh();
  }
}

export interface Callbacks {
  signOut(): void;
}
