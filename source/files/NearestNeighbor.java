// Johdatus tekoalyyn, syksy 2011
// Esimerkkiratkaisu tehtavaan 5.1
// koodi: Patrik Hoyer, Mika Laitinen, Teemu Roos

// Introduction to Artificial Intelligence, fall 2017
// Model solution for exercise 5.5
// code: Patrik Hoyer, Mika Laitinen, Teemu Roos

import java.awt.image.*;
import javax.imageio.*;
import java.io.*;
import java.util.*;

class Pair implements Comparable<Pair> {
    public int x,y;
    
    @Override
    public int compareTo(Pair p) {
        return this.y - p.y;
    }
}

class Image implements Comparable<Image> {
    public Vector<Boolean> vec;
    public int characterClass;   // correct class
    public int distance;         // distance to the image

    public Image() {
    }

    @Override
    public int compareTo(Image i1) {
        return this.characterClass - i1.characterClass;
    }

    // calculate the distance to the image that's being tested
    public int evalDistance(Image image) {
        int fails = 0;
        for(int i = 0; i < image.vec.size(); ++i) {
            if(image.vec.elementAt(i) != this.vec.elementAt(i)) {
                ++fails;
            }
        }
	distance = fails;
        return fails;
    }
}

// class that can be used to sort the images into order by distance
class NeighbourComparator implements Comparator<Image> {
    public NeighbourComparator() {
    }

    // compares using the distance
    @Override
    public int compare(Image i1, Image i2) {
        return i1.distance - i2.distance;
    }
}

public class NearestNeighbor {
    static Vector<Image> I = new Vector<Image>();

    static void readImages(String xfilename, String yfilename) {
        try {
            Scanner xscanner = new Scanner(new File(xfilename));
            Scanner yscanner = new Scanner(new File(yfilename));
            while(xscanner.hasNextLine()) {
                Image i = new Image();
                String line = xscanner.nextLine();
                int characterClass = yscanner.nextInt();
                String splitarr[] = line.split(",");
                Vector<Boolean> vb = new Vector<Boolean>();
                for(String s : splitarr) {
                    if(s.equals("1")) {
                        vb.addElement(Boolean.TRUE);
                    } else vb.addElement(Boolean.FALSE);
                }
                i.vec = vb;
                i.characterClass = characterClass;
                I.addElement(i);
            }
        } catch(Exception e) {
            e.printStackTrace();
        }
    }

    static void writeBMP(Image i, String filename) {
        BufferedImage bi = new BufferedImage(28,28,BufferedImage.TYPE_3BYTE_BGR); 
        for(int y = 0; y < 28; ++y) {
            for(int x = 0; x < 28; ++x) {
                int ind = y*28+x;
                bi.setRGB(x,y,(i.vec.elementAt(ind)?0:0xffffff));
            }
        }
        try {
            ImageIO.write(bi,"BMP",new File(filename));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // k-NN classifier
    static void kClassify(int k) {
	NeighbourComparator nc = new NeighbourComparator(); // classifier
        int failures = 0;            // counter of failures
        // save training data to a new vector than can be sorted
        
        // if you want to test the code quickly, you can list e.g. only 1000
        // first vectors (so change "i < 5000" to "i < 1000")
        Vector<Image> data = new Vector<Image>();
        for(int i = 0; i < 5000; ++i) data.addElement(I.elementAt(i));
	
	int trials = 0;              // counter of trials
        // iterate through all test cases
        for(int test = 5000; test < (int)I.size(); ++test) {
            System.out.print("classifying "+test);
            // update distance from each training vector to test vector
	    for (int train = 0; train < (int)data.size(); ++train)
		data.elementAt(train).evalDistance(I.elementAt(test));
            // sort training vectors by distance
            Collections.sort(data,nc);

            // initialize a table to which we can count occurrences of every
            // class in k nearest neighbor
            Vector<Pair> results = new Vector<Pair>();
            for(int j = 0; j < 10; ++j) {
                Pair p = new Pair();
                p.x = j;
                results.addElement(p);
            }
            
            // iterate through k nearest neighbors and update counters for
            // occurrences of every class
            for(int j = 0; j < k; ++j) {
                results.elementAt(data.elementAt(j).characterClass).y++;
            }
            
            // sort classes by occurrences into decending order,
            // i.e. the class with most occurrences will be the first            
            Comparator<Pair> comparator = Collections.reverseOrder();
            Collections.sort(results,comparator);

            // print the classification result, the correct answer and error rate
	    System.out.print(": result "+results.elementAt(0).x);
	    System.out.print(" (true "+I.elementAt(test).characterClass+")");
            if(results.elementAt(0).x != I.elementAt(test).characterClass) {
                ++failures;
            }
	    ++trials;
	    System.out.format(" error rate %.1f%%\n",100.*failures/trials);
        }

        // the error rate when all the test cases have been processed
        System.out.format("Final error rate with k = "+k+" was %.1f%%\n",100.*failures/trials);
    }

    static void testInput() {
        // take first hundred, sort by characterClass and draw a large picture,
        // then check that the letters appear one after another

        Vector<Image> I100 = new Vector<Image>();
        for(int i = 0; i < 100; ++i) I100.addElement(I.elementAt(i));

        Collections.sort(I100);

        BufferedImage bi = new BufferedImage(28*100,28,
                BufferedImage.TYPE_3BYTE_BGR);

        for(int i = 0; i < 100; ++i) {
            for(int y = 0; y < 28; ++y) {
                for(int x = 0; x < 28; ++x) {
                    int ind = y*28+x;
                    bi.setRGB(x+i*28,y,
                            (I100.elementAt(i).vec.elementAt(ind)?
                             0:0xffffff));
                }
            }
        }
        try {
            ImageIO.write(bi,"BMP",new File("test100.bmp"));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void main(String[] args) {
        readImages(args[0],args[1]);
        testInput();
        for(int k = 1; k <= 10; ++k) {
            kClassify(k);
        }
    }
};
