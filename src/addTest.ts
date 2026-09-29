import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createCentreAndTest() {
    try {
        // ۱. Aadhi ek navin Centre banav
        const newCentre = await prisma.diagnosticCentre.create({
            data: {
                name: 'City Care Lab',
                location: 'Pimpri-Chinchwad'
            }
        });
        console.log("🏥 Navin Centre tayar zhala! ID:", newCentre.id);

        // ۲. Mag tya navin Centre chya ID var Test banav
        const newTest = await prisma.test.create({
            data: {
                name: 'Blood Test',
                price: 500,
                centreId: newCentre.id 
            }
        });
        
        console.log("🔥 Test yashasviritia add zhali!");
        console.log("👇 HA TUZA NAVIN TEST ID AHE, HA COPY KAR 👇");
        console.log(newTest.id);

    } catch (error) {
        console.error("Kahitari chukla:", error);
    } finally {
        await prisma.$disconnect();
    }
}

createCentreAndTest();