import { Font } from '@react-pdf/renderer';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import { formatDate, formatRichText, translate } from "@/lib/utils"
import { PersonalInfo } from '@/lib/slices/personalSlice';
import { DBExperience, DBEducation, DBCourse } from '@/lib/db';
import { Skills } from '@/lib/slices/skillsSlice';
import { Footer } from '@/lib/slices/footerSlice';
import { Freelance } from '@/lib/slices/freelanceSlice';

export interface CVTemplateProps {
    lang: string;
    personal: PersonalInfo;
    experiences: DBExperience[];
    educations: DBEducation[];
    courses: DBCourse[];
    skills: Skills;
    freelance: Freelance;
    footer: Footer;
}

Font.register({
    family: 'Roboto',
    fonts: [
        {
            src: '/fonts/Roboto/Roboto-Regular.ttf',
        },
        {
            src: '/fonts/Roboto/Roboto-Bold.ttf',
            fontWeight: 'bold',
        },
        {
            src: '/fonts/Roboto/Roboto-Light.ttf',
            fontWeight: 'light',
        }
    ],
});

const ACCENT_COLOR = '#E8D5C4'; // Pastelowy beż/róż

const pastelsStyles = StyleSheet.create({
    page: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        fontSize: 10,
        fontFamily: 'Roboto',
    },
    
    // Lewa kolumna - biała
    leftColumn: {
        width: '37%',
        backgroundColor: '#ffffff',
        padding: 32,
        paddingTop: 40,
    },
    profilePhoto: {
        width: 120,
        height: 120,
        borderRadius: 60,
        objectFit: 'cover',
        alignSelf: 'center',
        marginBottom: 24,
    },
    fullName: {
        fontSize: 32,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        color: ACCENT_COLOR,
        lineHeight: 1.1,
        marginBottom: 8,
    },
    jobTitle: {
        fontSize: 13,
        textTransform: 'uppercase',
        color: '#000000',
        fontWeight: 'bold',
        marginBottom: 32,
    },
    leftSectionTitle: {
        fontSize: 10,
        textTransform: 'uppercase',
        fontWeight: 'bold',
        color: '#000000',
        marginBottom: 12,
        marginTop: 24,
    },
    contactItem: {
        fontSize: 9,
        color: '#333333',
        marginBottom: 6,
    },
    
    // Prawa kolumna - pastelowe tło
    rightColumn: {
        width: '63%',
        backgroundColor: ACCENT_COLOR,
        padding: 32,
        paddingTop: 40,
    },
    sectionHeaderBox: {
        backgroundColor: '#ffffff',
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginBottom: 16,
        marginTop: 24,
        marginHorizontal: 8,
    },
    sectionHeaderBoxFirst: {
        backgroundColor: '#ffffff',
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginBottom: 16,
        marginTop: 0,
        marginHorizontal: 8,
    },
    sectionHeaderText: {
        fontSize: 11,
        textTransform: 'uppercase',
        fontWeight: 'bold',
        color: '#000000',
        letterSpacing: 0.5,
    },
    summaryText: {
        fontSize: 9,
        color: '#333333',
        lineHeight: 1.5,
        marginHorizontal: 8,
    },
    bulletList: {
        marginHorizontal: 8,
    },
    bulletItem: {
        fontSize: 9,
        color: '#333333',
        marginBottom: 4,
        lineHeight: 1.4,
    },
    experienceItem: {
        marginBottom: 16,
        marginHorizontal: 8,
    },
    experienceTitle: {
        fontSize: 11,
        textTransform: 'uppercase',
        fontWeight: 'bold',
        color: '#000000',
        marginBottom: 3,
    },
    experienceCompany: {
        fontSize: 9,
        color: '#333333',
        marginBottom: 2,
    },
    experienceDescription: {
        fontSize: 9,
        color: '#333333',
        marginTop: 4,
        lineHeight: 1.4,
    },
    footer: {
        marginTop: 16,
        paddingTop: 12,
        borderTop: '1px solid rgba(0,0,0,0.1)',
        marginHorizontal: 8,
    },
    footerText: {
        fontSize: 8,
        color: '#666666',
    },
});

export default function PastelsCV({
    lang,
    personal,
    experiences,
    educations,
    courses,
    skills,
    freelance,
    footer
}: CVTemplateProps) {
    return (
        <Document>
            <Page size="A4" style={pastelsStyles.page}>
                {/* Lewa kolumna - biała */}
                <View style={pastelsStyles.leftColumn}>
                    {/* Zdjęcie profilowe */}
                    {personal.photo && (
                        <Image
                            src={personal.photo}
                            style={pastelsStyles.profilePhoto}
                        />
                    )}

                    {/* Imię i Nazwisko */}
                    <Text style={pastelsStyles.fullName}>
                        {personal.firstName}
                    </Text>
                    <Text style={pastelsStyles.fullName}>
                        {personal.lastName}
                    </Text>

                    {/* Stanowisko */}
                    <Text style={pastelsStyles.jobTitle}>
                        {translate(lang, 'cv')}
                    </Text>

                    {/* Sekcja kontaktowa */}
                    <Text style={pastelsStyles.leftSectionTitle}>
                        SKONTAKTUJ SIĘ Z {personal.firstName?.toUpperCase()}
                    </Text>
                    {personal.phone && (
                        <Text style={pastelsStyles.contactItem}>
                            {personal.phone}
                        </Text>
                    )}
                    {personal.email && (
                        <Text style={pastelsStyles.contactItem}>
                            {personal.email}
                        </Text>
                    )}
                </View>

                {/* Prawa kolumna - pastelowe tło */}
                <View style={pastelsStyles.rightColumn}>
                    {/* Profil/O mnie */}
                    {personal.aboutDescription && (
                        <View>
                            <View style={pastelsStyles.sectionHeaderBoxFirst}>
                                <Text style={pastelsStyles.sectionHeaderText}>
                                    POZNAJCIE {personal.firstName?.toUpperCase()}!
                                </Text>
                            </View>
                            <Text style={pastelsStyles.summaryText}>
                                {personal.aboutDescription}
                            </Text>
                        </View>
                    )}

                    {/* Umiejętności */}
                    {skills.skillsText && (
                        <View>
                            <View style={pastelsStyles.sectionHeaderBox}>
                                <Text style={pastelsStyles.sectionHeaderText}>
                                    UMIEJĘTNOŚCI TECHNICZNE
                                </Text>
                            </View>
                            <View style={pastelsStyles.bulletList}>
                                {formatRichText(skills.skillsText).map((segment, index) => (
                                    <Text
                                        key={index}
                                        style={{
                                            ...pastelsStyles.bulletItem,
                                            fontWeight: segment.bold ? 'bold' : 'normal',
                                            fontStyle: segment.italic ? 'italic' : 'normal',
                                        }}
                                    >
                                        - {segment.text}
                                    </Text>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Doświadczenie zawodowe */}
                    {experiences.length > 0 && (
                        <View>
                            <View style={pastelsStyles.sectionHeaderBox}>
                                <Text style={pastelsStyles.sectionHeaderText}>
                                    DOŚWIADCZENIE ZAWODOWE
                                </Text>
                            </View>
                            {experiences.map((experience) => (
                                <View key={experience.id} style={pastelsStyles.experienceItem}>
                                    <Text style={pastelsStyles.experienceTitle}>
                                        {experience.title}
                                    </Text>
                                    <Text style={pastelsStyles.experienceCompany}>
                                        {experience.company}
                                    </Text>
                                    <Text style={pastelsStyles.experienceCompany}>
                                        {formatDate(experience.startDate, 'short')} - {experience.isOngoing ? translate(lang, 'present') : formatDate(experience.endDate, 'short')}
                                    </Text>
                                    {experience.description && (
                                        <Text style={pastelsStyles.experienceDescription}>
                                            - {experience.description}
                                        </Text>
                                    )}
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Wykształcenie */}
                    {educations.length > 0 && (
                        <View>
                            <View style={pastelsStyles.sectionHeaderBox}>
                                <Text style={pastelsStyles.sectionHeaderText}>
                                    WYKSZTAŁCENIE
                                </Text>
                            </View>
                            {educations.map((education) => (
                                <View key={education.id} style={pastelsStyles.experienceItem}>
                                    <Text style={pastelsStyles.experienceTitle}>
                                        {education.institution}
                                    </Text>
                                    <Text style={pastelsStyles.experienceCompany}>
                                        {education.degree} - {education.fieldOfStudy}
                                    </Text>
                                    <Text style={pastelsStyles.experienceCompany}>
                                        {formatDate(education.startDate, 'short')} - {education.isOngoing ? translate(lang, 'present') : formatDate(education.endDate, 'short')}
                                    </Text>
                                    {education.description && (
                                        <Text style={pastelsStyles.experienceDescription}>
                                            - {education.description}
                                        </Text>
                                    )}
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Kursy i certyfikaty */}
                    {courses.length > 0 && (
                        <View>
                            <View style={pastelsStyles.sectionHeaderBox}>
                                <Text style={pastelsStyles.sectionHeaderText}>
                                    KURSY I CERTYFIKATY
                                </Text>
                            </View>
                            {courses.map((course) => (
                                <View key={course.id} style={pastelsStyles.experienceItem}>
                                    <Text style={pastelsStyles.experienceTitle}>
                                        {course.courseName}
                                    </Text>
                                    <Text style={pastelsStyles.experienceCompany}>
                                        {course.platform}
                                    </Text>
                                    <Text style={pastelsStyles.experienceCompany}>
                                        {course.isOngoing ? translate(lang, 'in_progress') : `${translate(lang, 'completed')}: ${formatDate(course.completionDate, 'short')}`}
                                    </Text>
                                    {course.description && (
                                        <Text style={pastelsStyles.experienceDescription}>
                                            - {course.description}
                                        </Text>
                                    )}
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Freelance */}
                    {freelance.freelanceText && (
                        <View>
                            <View style={pastelsStyles.sectionHeaderBox}>
                                <Text style={pastelsStyles.sectionHeaderText}>
                                    FREELANCE
                                </Text>
                            </View>
                            <View style={pastelsStyles.bulletList}>
                                {formatRichText(freelance.freelanceText).map((segment, index) => (
                                    <Text
                                        key={index}
                                        style={{
                                            ...pastelsStyles.bulletItem,
                                            fontWeight: segment.bold ? 'bold' : 'normal',
                                            fontStyle: segment.italic ? 'italic' : 'normal',
                                        }}
                                    >
                                        - {segment.text}
                                    </Text>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Footer */}
                    {footer.footerText && (
                        <View style={pastelsStyles.footer}>
                            <Text style={pastelsStyles.footerText}>{footer.footerText}</Text>
                        </View>
                    )}
                </View>
            </Page>
        </Document>
    )
}
