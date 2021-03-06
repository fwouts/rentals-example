import { connection } from "@/db/connections";
import { Apartment } from "@/db/entities/apartment";
import { findUser, REALTOR_HELENA, REALTOR_JOHN } from "@/testing/users";

export async function findNewestApartment(
  realtorEmail?: string,
): Promise<Apartment> {
  let apartment = null;
  if (realtorEmail) {
    const realtor = await findUser(realtorEmail);
    apartment = await connection.manager.findOne(Apartment, {
      where: {
        realtor: {
          userId: realtor.userId,
        },
      },
      order: {
        added: "DESC",
      },
    });
  } else {
    apartment = await connection.manager.findOne(Apartment, {
      order: {
        added: "DESC",
      },
    });
  }
  if (!apartment) {
    throw new Error(`No apartment found.`);
  }
  return apartment;
}

export async function createTestApartments(): Promise<void> {
  const apartments: Apartment[] = [];
  for (let i = 0; i < 100; i++) {
    for (const realtorEmail of [REALTOR_HELENA, REALTOR_JOHN]) {
      const realtor = await findUser(realtorEmail);
      apartments.push(
        Apartment.create(
          {
            floorArea: 10 + i,
            pricePerMonth: 1000 + i * 10,
            numberOfRooms: i,
            coordinates: {
              latitude: Math.random() * 180 - 90,
              longitude: Math.random() * 360 - 180,
            },
            // One third of the apartments will be rentable.
            rented: i % 3 > 0,
          },
          realtor.userId,
        ),
      );
    }
  }
  await connection.manager.save(apartments);
}
