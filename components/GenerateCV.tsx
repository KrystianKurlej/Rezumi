import { Font } from '@react-pdf/renderer';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { formatDate, formatRichText, translate } from "@/lib/utils"
import { PersonalInfo } from '@/lib/slices/personalSlice';
import { DBExperience, DBEducation, DBCourse } from '@/lib/db';
import { Skills } from '@/lib/slices/skillsSlice';
import { Footer } from '@/lib/slices/footerSlice';

interface GenerateCVProps {
    lang: string;
    personal: PersonalInfo;
    experiences: DBExperience[];
    educations: DBEducation[];
    courses: DBCourse[];
    skills: Skills;
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

Font.register({
    family: 'Playfair Display',
    fonts: [
        {
            src: '/fonts/PlayfairDisplay/PlayfairDisplay-Regular.ttf',
        },
        {
            src: '/fonts/PlayfairDisplay/PlayfairDisplay-Bold.ttf',
            fontWeight: 'bold',
        },
    ],
});

const classicStyles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: 'white',
        padding: 40,
        fontSize: 11,
        fontFamily: 'Roboto',
        fontWeight: 'light',
    },
    headerSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    section: {
        marginBottom: 10
    },
    sectionHeader: {
        marginBottom: 4,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        borderBottom: '1px solid gray',
        paddingBottom: 4,
    },
    sectionItem: {
        paddingTop: 6,
        paddingBottom: 6,
        borderBottom: '1px solid lightgray',
    },
    sectionItemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    footer: {
        marginTop: 12,
    },
    footerText: {
        fontSize: 9,
        color: 'gray',
    },
});

const minimalisticStyles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: 'white',
        padding: 40,
        fontSize: 11,
        fontFamily: 'Roboto',
    },
    headerSection: {
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontFamily: 'Playfair Display',
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    contentSection: {
        borderTop: '1px solid lightgray',
        flexDirection: 'row',
    },
    columnLeft: {
        width: '35%',
        paddingRight: 20,
        borderRight: '1px solid lightgray',
        paddingTop: 10,
    },
    columnRight: {
        width: '65%',
        paddingLeft: 20,
        paddingTop: 10,
    },
    columnSection: {
        borderBottom: '1px solid lightgray',
        paddingTop: 10,
        paddingBottom: 10,
    },
    sectionTitle: {
        fontSize: 12,
        paddingBottom: 4,
        textTransform: 'uppercase',
    },
    sectionItem: {
        paddingTop: 6,
        paddingBottom: 6,
    },
    sectionItemContent: {
        color: '#555555',
    },
    sectionItemHeader: {
        marginBottom: 4,
    },
    footer: {
        marginTop: 12,
    },
    footerText: {
        fontSize: 9,
        color: 'gray',
        textAlign: 'center',
    },
});

export default function GenerateCV({
    lang,
    personal,
    experiences,
    educations,
    courses,
    skills,
    footer
}: GenerateCVProps) {
    return(
        <Document>
            <Page size="A4" style={classicStyles.page}>
                <View style={classicStyles.headerSection}>
                    <View>
                        <Text>
                            {translate(lang, 'cv')}
                        </Text>
                        <Text style={classicStyles.title}>{personal.firstName} {personal.lastName}</Text>
                        {personal.email && <Text style={{ marginTop: 2 }}>{personal.email}</Text>}
                        {personal.phone && <Text style={{ marginTop: 2 }}>{personal.phone}</Text>}
                    </View>
                    <View>
                    </View>
                </View>

                {experiences.length > 0 && (
                    <View style={classicStyles.section}>
                        <Text style={classicStyles.sectionTitle}>
                            {translate(lang, 'experience')}
                        </Text>
                        {experiences.map((experience) => (
                            <View key={experience.id} style={classicStyles.sectionItem}>
                                <View style={classicStyles.sectionItemHeader}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ fontWeight: 'bold' }}>{experience.title} </Text>
                                        <Text>- {experience.company}</Text>
                                    </View>
                                    <Text>{formatDate(experience.startDate, 'short')} - {experience.isOngoing ? translate(lang, 'present') : formatDate(experience.endDate, 'short')}</Text>
                                </View>
                                <Text>{experience.description}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {educations.length > 0 && (
                    <View style={classicStyles.section}>
                        <Text style={classicStyles.sectionTitle}>
                            {translate(lang, 'education')}
                        </Text>
                        {educations.map((education) => (
                            <View key={education.id} style={classicStyles.sectionItem}>
                                <View style={classicStyles.sectionItemHeader}>
                                    <View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ fontWeight: 'bold' }}>{education.degree} </Text>
                                            <Text>- {education.fieldOfStudy}</Text>
                                        </View>
                                        <Text style={{ marginTop: 2 }}>{education.institution}</Text>
                                    </View>
                                    <Text>{formatDate(education.startDate, 'short')} - {education.isOngoing ? translate(lang, 'present') : formatDate(education.endDate, 'short')}</Text>
                                </View>
                                <Text>{education.description}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {courses.length > 0 && (
                    <View style={classicStyles.section}>
                        <Text style={classicStyles.sectionTitle}>
                            {translate(lang, 'courses_certifications')}
                        </Text>
                        {courses.map((course) => (
                            <View key={course.id} style={classicStyles.sectionItem}>
                                <View style={classicStyles.sectionItemHeader}>
                                    <View>
                                        <Text style={{ fontWeight: 'bold' }}>{course.courseName}</Text>
                                        <Text style={{ marginTop: 2 }}>{course.platform}</Text>
                                    </View>
                                    <Text>{course.isOngoing ? translate(lang, 'in_progress') : `${translate(lang, 'completed')}: ${formatDate(course.completionDate, 'short')}`}</Text>
                                </View>
                                {course.description && <Text>{course.description}</Text>}
                            </View>
                        ))}
                    </View>
                )}

                {skills.skillsText && (
                    <View style={classicStyles.section}>
                        <View style={classicStyles.sectionHeader}>
                            <Text style={classicStyles.sectionTitle}>
                                {translate(lang, 'skills')}
                            </Text>
                        </View>
                        {formatRichText(skills.skillsText).map((segment, index) => (
                            <Text
                                key={index}
                                style={{
                                    marginBottom: 1,
                                    fontWeight: segment.bold ? 'bold' : 'normal',
                                    fontStyle: segment.italic ? 'italic' : 'normal',
                                }}
                            >
                                {segment.text}
                            </Text>
                        ))}
                    </View>
                )}

                {footer.footerText && (
                    <View style={classicStyles.footer}>
                        <Text style={classicStyles.footerText}>{footer.footerText}</Text>
                    </View>
                )}
            </Page>
        </Document>
    )
}

export function GenerateMinimalisticCV({
    lang,
    personal,
    experiences,
    educations,
    courses,
    skills,
    footer
}: GenerateCVProps) {
    return(
        <Document>
            <Page size="A4" style={minimalisticStyles.page}>
                <View style={minimalisticStyles.headerSection}>
                    <Text>{translate(lang, 'cv')}</Text>
                    <Text style={minimalisticStyles.title}>{personal.firstName}</Text>
                    <Text style={minimalisticStyles.title}>{personal.lastName}</Text>
                </View>
                <View style={minimalisticStyles.contentSection}>
                    <View style={minimalisticStyles.columnLeft}>
                        <View style={minimalisticStyles.columnSection}>
                            {personal.email && <Text style={{ marginTop: 2 }}>{personal.email}</Text>}
                            {personal.phone && <Text style={{ marginTop: 2 }}>{personal.phone}</Text>}
                        </View>
                        {skills.skillsText && (
                            <View style={minimalisticStyles.columnSection}>
                                <Text style={minimalisticStyles.sectionTitle}>
                                    {translate(lang, 'skills')}
                                </Text>
                                {formatRichText(skills.skillsText).map((segment, index) => (
                                    <Text
                                        key={index}
                                        style={{
                                            marginBottom: 1,
                                            fontWeight: segment.bold ? 'bold' : 'normal',
                                            fontStyle: segment.italic ? 'italic' : 'normal',
                                        }}
                                    >
                                        {segment.text}
                                    </Text>
                                ))}
                            </View>
                        )}
                    </View>
                    <View style={minimalisticStyles.columnRight}>
                        {experiences.length > 0 && (
                            <View style={minimalisticStyles.columnSection}>
                                <Text style={minimalisticStyles.sectionTitle}>
                                    {translate(lang, 'experience')}
                                </Text>
                                {experiences.map((experience) => (
                                    <View key={experience.id} style={minimalisticStyles.sectionItem}>
                                        <View style={minimalisticStyles.sectionItemHeader}>
                                            <Text style={{ fontWeight: 'bold' }}>{experience.title}</Text>
                                            <Text>{experience.company} | {formatDate(experience.startDate, 'short')} - {experience.isOngoing ? translate(lang, 'present') : formatDate(experience.endDate, 'short')}</Text>
                                        </View>
                                        <Text style={minimalisticStyles.sectionItemContent}>{experience.description}</Text>
                                    </View>
                                ))}
                            </View>
                        )}
                        {educations.length > 0 && (
                            <View style={minimalisticStyles.columnSection}>
                                <Text style={minimalisticStyles.sectionTitle}>
                                    {translate(lang, 'education')}
                                </Text>
                                {educations.map((education) => (
                                    <View key={education.id} style={minimalisticStyles.sectionItem}>
                                        <View style={minimalisticStyles.sectionItemHeader}>
                                            <Text style={{ fontWeight: 'bold' }}>{education.degree} | {education.fieldOfStudy}</Text>
                                            <Text>{education.institution} | {formatDate(education.startDate, 'short')} - {education.isOngoing ? translate(lang, 'present') : formatDate(education.endDate, 'short')}</Text>
                                        </View>
                                        <Text>{education.description}</Text>
                                    </View>
                                ))}
                            </View>
                        )}
                        {courses.length > 0 && (
                            <View style={minimalisticStyles.columnSection}>
                                <Text style={minimalisticStyles.sectionTitle}>
                                    {translate(lang, 'courses_certifications')}
                                </Text>
                                {courses.map((course) => (
                                    <View key={course.id} style={minimalisticStyles.sectionItem}>
                                        <View style={minimalisticStyles.sectionItemHeader}>
                                            <Text style={{ fontWeight: 'bold' }}>{course.courseName}</Text>
                                            <Text>{course.platform} | {course.isOngoing ? translate(lang, 'in_progress') : `${translate(lang, 'completed')}: ${formatDate(course.completionDate, 'short')}`}</Text>
                                        </View>
                                        {course.description && <Text>{course.description}</Text>}
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                </View>

                {footer.footerText && (
                    <View style={minimalisticStyles.footer}>
                        <Text style={minimalisticStyles.footerText}>{footer.footerText}</Text>
                    </View>
                )}
            </Page>
        </Document>
    )
}